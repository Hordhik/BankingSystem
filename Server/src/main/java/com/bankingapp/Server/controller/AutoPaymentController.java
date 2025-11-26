package com.bankingapp.Server.controller;

import com.bankingapp.Server.model.*;
import com.bankingapp.Server.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/autopayments")
public class AutoPaymentController {

    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public AutoPaymentController(LoanRepository loanRepository, AccountRepository accountRepository, TransactionRepository transactionRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/process/{userId}")
    @Transactional
    public ResponseEntity<?> processAutopay(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            List<Loan> loans = loanRepository.findByUserIdOrderByCreatedAtDesc(userId);
            
            BigDecimal totalDue = BigDecimal.ZERO;
            int activeLoansCount = 0;

            for (Loan loan : loans) {
                if (loan.getStatus() == LoanStatus.ACTIVE && loan.getMonthlyEmi() != null) {
                    totalDue = totalDue.add(loan.getMonthlyEmi());
                    activeLoansCount++;
                }
            }

            if (activeLoansCount == 0) {
                return ResponseEntity.badRequest().body("No active loans found to pay.");
            }

            if (totalDue.compareTo(BigDecimal.ZERO) == 0) {
                 return ResponseEntity.ok("Total due is zero. Nothing to pay.");
            }

            if (account.getBalance().compareTo(totalDue) < 0) {
                return ResponseEntity.badRequest().body("Insufficient funds. Required: ₹" + totalDue + ", Available: ₹" + account.getBalance());
            }

            // Deduct balance
            account.setBalance(account.getBalance().subtract(totalDue));
            accountRepository.save(account);

            // Create Transaction
            Transaction transaction = new Transaction();
            transaction.setAccount(account);
            transaction.setType("LOAN_AUTOPAYMENT");
            transaction.setAmount(totalDue); 
            transaction.setTransactionId(UUID.randomUUID().toString());
            transaction.setCreatedAt(LocalDateTime.now());
            transaction.setFee(BigDecimal.ZERO);
            transaction.setTax(BigDecimal.ZERO);
            
            transactionRepository.save(transaction);

            return ResponseEntity.ok("Autopayment processed successfully. Debited: ₹" + totalDue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing autopayment: " + e.getMessage());
        }
    }
}
