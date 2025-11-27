package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.TransactionResponse;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.Transaction;
import com.bankingapp.Server.model.Card;
import com.bankingapp.Server.repository.AccountRepository;
import com.bankingapp.Server.repository.CardRepository;
import com.bankingapp.Server.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CardRepository cardRepository;

    private final TransactionLoggingService transactionLoggingService;
    private final LoanService loanService;

    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository,
            CardRepository cardRepository, TransactionLoggingService transactionLoggingService, LoanService loanService) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.cardRepository = cardRepository;
        this.transactionLoggingService = transactionLoggingService;
        this.loanService = loanService;
    }

    @Transactional
    public Account deposit(Long accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        try {
            account.setBalance(account.getBalance().add(amount));
            Account saved = accountRepository.save(account);
            transactionLoggingService.saveTransaction(saved, "DEPOSIT", amount, null, BigDecimal.ZERO, BigDecimal.ZERO,
                    "SUCCESS");
            return saved;
        } catch (Exception e) {
            transactionLoggingService.saveTransaction(account, "DEPOSIT", amount, null, BigDecimal.ZERO,
                    BigDecimal.ZERO, "FAILED");
            throw e;
        }
    }
    
    // ... (existing methods)



    @Transactional
    public Account withdraw(Long accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be positive");
        }
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        try {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new IllegalArgumentException("Insufficient funds");
            }
            account.setBalance(account.getBalance().subtract(amount));
            Account saved = accountRepository.save(account);
            transactionLoggingService.saveTransaction(saved, "WITHDRAW", amount, null, BigDecimal.ZERO, BigDecimal.ZERO,
                    "SUCCESS");
            return saved;
        } catch (Exception e) {
            transactionLoggingService.saveTransaction(account, "WITHDRAW", amount, null, BigDecimal.ZERO,
                    BigDecimal.ZERO, "FAILED");
            throw e;
        }
    }

    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, BigDecimal fee, BigDecimal tax) {
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to same account");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        BigDecimal safeFee = fee != null ? fee : BigDecimal.ZERO;
        BigDecimal safeTax = tax != null ? tax : BigDecimal.ZERO;
        BigDecimal totalDeduction = amount.add(safeFee).add(safeTax);

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Destination account not found"));

        System.out.println("Transfer Debug: FromAccount=" + from.getAccountNumber() + ", Balance=" + from.getBalance()
                + ", Amount=" + amount + ", TotalDeduction=" + totalDeduction);

        try {
            if (from.getBalance().compareTo(totalDeduction) < 0) {
                System.out.println("Transfer Failed: Insufficient funds. Balance=" + from.getBalance() + ", Required="
                        + totalDeduction);
                throw new IllegalArgumentException("Insufficient funds for transfer + fees");
            }

            from.setBalance(from.getBalance().subtract(totalDeduction));
            to.setBalance(to.getBalance().add(amount));

            accountRepository.save(from);
            accountRepository.save(to);

            transactionLoggingService.saveTransaction(from, "TRANSFER_SENT", amount, to.getId(), safeFee, safeTax,
                    "SUCCESS");
            transactionLoggingService.saveTransaction(to, "TRANSFER_RECEIVED", amount, from.getId(), BigDecimal.ZERO,
                    BigDecimal.ZERO, "SUCCESS");
        } catch (Exception e) {
            transactionLoggingService.saveTransaction(from, "TRANSFER_SENT", amount, to.getId(), safeFee, safeTax,
                    "FAILED");
            transactionLoggingService.saveTransaction(to, "TRANSFER_RECEIVED", amount, from.getId(), BigDecimal.ZERO,
                    BigDecimal.ZERO, "FAILED");
            throw e;
        }
    }

    @Transactional
    public void transferByCard(String senderCardNumber, String senderCvv, String senderExpiry, String pin,
            String receiverCardNumber, BigDecimal amount) {
        System.out.println("Card Transfer Request: SenderCard=" + senderCardNumber + ", Amount=" + amount);

        Card senderCard = cardRepository.findByCardNumber(senderCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Sender card not found"));

        if (!senderCard.getCvv().equals(senderCvv)) {
            throw new IllegalArgumentException("Invalid CVV");
        }
        
        // PIN Verification
        if (senderCard.getPin() != null && !senderCard.getPin().equals(pin)) {
             throw new IllegalArgumentException("Invalid PIN");
        } else if (senderCard.getPin() != null && pin == null) {
             throw new IllegalArgumentException("PIN required");
        }
        // Simple expiry check (MM/YY)
        // In production, parse date properly

        Card receiverCard = cardRepository.findByCardNumber(receiverCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Receiver card not found"));

        Account from = senderCard.getAccount();
        Account to = receiverCard.getAccount();

        System.out.println("Card Transfer Resolved: FromAccount=" + from.getAccountNumber() + ", ToAccount="
                + to.getAccountNumber());

        BigDecimal fee = amount.multiply(new BigDecimal("0.01"));
        BigDecimal tax = fee.multiply(new BigDecimal("0.18"));
        BigDecimal totalDeduction = amount.add(fee).add(tax);

        if (from.getBalance().compareTo(totalDeduction) < 0) {
            transactionLoggingService.saveTransaction(from, "CARD_PAYMENT", amount, to.getId(), fee, tax, "FAILED");
            throw new IllegalArgumentException("Insufficient funds for card transfer + fees");
        }

        try {
            from.setBalance(from.getBalance().subtract(totalDeduction));
            to.setBalance(to.getBalance().add(amount));

            accountRepository.save(from);
            accountRepository.save(to);

            transactionLoggingService.saveTransaction(from, "CARD_PAYMENT", amount, to.getId(), fee, tax, "SUCCESS");
            transactionLoggingService.saveTransaction(to, "CARD_RECEIVE", amount, from.getId(), BigDecimal.ZERO,
                    BigDecimal.ZERO, "SUCCESS");
        } catch (Exception e) {
            transactionLoggingService.saveTransaction(from, "CARD_PAYMENT", amount, to.getId(), fee, tax, "FAILED");
            transactionLoggingService.saveTransaction(to, "CARD_RECEIVE", amount, from.getId(), BigDecimal.ZERO,
                    BigDecimal.ZERO, "FAILED");
            throw e;
        }
    }

    @Transactional
    public void processAutopayment(Long userId, BigDecimal amount) {
        // Find user's primary card or account
        List<Card> cards = cardRepository.findByUser_UserId(userId);
        if (cards.isEmpty()) {
            throw new IllegalArgumentException("No cards found for user to process autopayment");
        }
        
        // Prefer primary card, otherwise first card
        Card card = cards.stream()
                .filter(Card::isPrimary)
                .findFirst()
                .orElse(cards.get(0));

        Account account = card.getAccount();

        if (account.getBalance().compareTo(amount) < 0) {
            transactionLoggingService.saveTransaction(account, "AUTOPAY_FAIL", amount, null, BigDecimal.ZERO, BigDecimal.ZERO, "FAILED");
            throw new IllegalArgumentException("Insufficient funds for autopayment");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        transactionLoggingService.saveTransaction(account, "CARD_AUTOPAY", amount, null, BigDecimal.ZERO, BigDecimal.ZERO, "SUCCESS");
        
        // Update loan status
        loanService.recordPayment(userId);
    }

    public List<TransactionResponse> getTransactionsForAccount(Long accountId, String userEmail) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Verify that the account belongs to the authenticated user
        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Unauthorized: You can only view transactions for your own accounts");
        }

        return transactionRepository.findByAccountOrderByCreatedAtDesc(account)
                .stream()
                .map(t -> {
                    String counterpartyName = "Unknown";
                    if (t.getCounterpartyAccountId() != null) {
                        counterpartyName = accountRepository.findById(t.getCounterpartyAccountId())
                                .map(acc -> acc.getUser().getFullname())
                                .orElse("Unknown");
                    }

                    return TransactionResponse.builder()
                            .id(t.getId())
                            .type(t.getType())
                            .amount(t.getAmount())
                            .accountId(t.getAccount().getId())
                            .counterpartyAccountId(t.getCounterpartyAccountId())
                            .counterpartyName(counterpartyName)
                            .transactionId(t.getTransactionId())
                            .createdAt(t.getCreatedAt()) // LocalDateTime field
                            .fee(t.getFee())
                            .tax(t.getTax())
                            .status(t.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
