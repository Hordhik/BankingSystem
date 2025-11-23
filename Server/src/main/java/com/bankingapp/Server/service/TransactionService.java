package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.TransactionResponse;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.Transaction;
import com.bankingapp.Server.repository.AccountRepository;
import com.bankingapp.Server.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    private void saveTransaction(Account account, String type, BigDecimal amount, Long counterpartyAccountId) {
        Transaction tx = Transaction.builder()
                .account(account)
                .type(type)
                .amount(amount)
                .counterpartyAccountId(counterpartyAccountId)
                .createdAt(LocalDateTime.now())        // use LocalDateTime everywhere
                .build();
        transactionRepository.save(tx);
    }

    @Transactional
    public Account deposit(Long accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setBalance(account.getBalance().add(amount));
        Account saved = accountRepository.save(account);
        saveTransaction(saved, "DEPOSIT", amount, null);
        return saved;
    }

    @Transactional
    public Account withdraw(Long accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be positive");
        }
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }
        account.setBalance(account.getBalance().subtract(amount));
        Account saved = accountRepository.save(account);
        saveTransaction(saved, "WITHDRAW", amount, null);
        return saved;
    }

    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to same account");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Destination account not found"));

        if (from.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        accountRepository.save(from);
        accountRepository.save(to);

        saveTransaction(from, "TRANSFER_SENT", amount, to.getId());
        saveTransaction(to, "TRANSFER_RECEIVED", amount, from.getId());
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
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType())
                        .amount(t.getAmount())
                        .accountId(t.getAccount().getId())
                        .counterpartyAccountId(t.getCounterpartyAccountId())
                        .createdAt(t.getCreatedAt())   // LocalDateTime field
                        .build())
                .collect(Collectors.toList());
    }
}
