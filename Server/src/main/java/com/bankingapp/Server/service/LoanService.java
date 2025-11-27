package com.bankingapp.Server.service;

import com.bankingapp.Server.model.Loan;
import com.bankingapp.Server.model.LoanStatus;
import com.bankingapp.Server.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository repo;
    private final com.bankingapp.Server.repository.AccountRepository accountRepository;
    private final com.bankingapp.Server.repository.UserRepository userRepository;

    public LoanService(LoanRepository repo, com.bankingapp.Server.repository.AccountRepository accountRepository, com.bankingapp.Server.repository.UserRepository userRepository) {
        this.repo = repo;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Loan applyLoan(Loan loan) {
        loan.setStatus(LoanStatus.PENDING);
        loan.setInterestRate(BigDecimal.valueOf(10.0)); // default 10%
        return repo.save(loan);
    }

    public List<Loan> getLoansForUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }


    @Transactional
    public Loan approveLoan(Long id) {
        Loan loan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        BigDecimal P = loan.getPrincipalAmount();
        int N = loan.getTenureMonths();
        double annualRate = loan.getInterestRate().doubleValue() / 100.0;
        double R = annualRate / 12;

        double emi = (P.doubleValue() * R * Math.pow(1 + R, N))
                / (Math.pow(1 + R, N) - 1);

        BigDecimal monthlyEmi = BigDecimal.valueOf(emi).setScale(2, java.math.RoundingMode.HALF_UP);

        BigDecimal totalPayable = monthlyEmi.multiply(BigDecimal.valueOf(N)).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalInterest = totalPayable.subtract(P).setScale(2, java.math.RoundingMode.HALF_UP);

        loan.setMonthlyEmi(monthlyEmi);
        loan.setTotalInterest(totalInterest);
        loan.setTotalPayable(totalPayable);

        loan.setDetails(
                "Principal: ₹" + P +
                        " | Tenure: " + N + " months" +
                        " | EMI: ₹" + monthlyEmi.setScale(0, java.math.RoundingMode.HALF_UP)
        );

        loan.setStatus(LoanStatus.ACTIVE);
        loan.setAdminReason(null);

        loan.setNextPayment(
                "EMI due on " + LocalDate.now().plusMonths(1).getDayOfMonth()
        );

        // Credit loan amount to user account
        com.bankingapp.Server.model.User user = userRepository.findById(loan.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        com.bankingapp.Server.model.Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(P));
        accountRepository.save(account);

        return repo.save(loan);
    }

    @Transactional
    public Loan rejectLoan(Long id, String reason) {
        Loan loan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.REJECTED);
        loan.setAdminReason(reason);
        loan.setDetails("Rejected: " + reason);
        loan.setNextPayment(null);

        return repo.save(loan);
    }

    public List<Loan> getAllLoans() {
        return repo.findAll();
    }

    public BigDecimal calculateTotalEmi(Long userId) {
        List<Loan> loans = repo.findByUserIdOrderByCreatedAtDesc(userId);
        return loans.stream()
                .filter(l -> l.getStatus() == LoanStatus.ACTIVE)
                .map(Loan::getMonthlyEmi)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public void recordPayment(Long userId) {
        List<Loan> loans = repo.findByUserIdOrderByCreatedAtDesc(userId);
        for (Loan loan : loans) {
            if (loan.getStatus() == LoanStatus.ACTIVE) {
                int paid = loan.getEmisPaid() == null ? 0 : loan.getEmisPaid();
                loan.setEmisPaid(paid + 1);
                
                // Update next payment date
                loan.setNextPayment("EMI due on " + LocalDate.now().plusMonths(1).getDayOfMonth());
                
                // Update details
                String currentDetails = loan.getDetails();
                // Append or update paid status
                loan.setDetails(currentDetails + " | Paid: " + (paid + 1) + " months");
                
                repo.save(loan);
            }
        }
    }

    public Loan saveLoan(Loan loan) {
        return repo.save(loan);
    }
}
