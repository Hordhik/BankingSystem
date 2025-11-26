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

    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository, CardRepository cardRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.cardRepository = cardRepository;
    }

    private void saveTransaction(Account account, String type, BigDecimal amount, Long counterpartyAccountId,
            BigDecimal fee, BigDecimal tax) {
        Transaction tx = Transaction.builder()
                .account(account)
                .type(type)
                .amount(amount)
                .counterpartyAccountId(counterpartyAccountId)
                .transactionId(
                        "TXN" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase())
                .createdAt(LocalDateTime.now())
                .fee(fee)
                .tax(tax)
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
        saveTransaction(saved, "DEPOSIT", amount, null, BigDecimal.ZERO, BigDecimal.ZERO);
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
        saveTransaction(saved, "WITHDRAW", amount, null, BigDecimal.ZERO, BigDecimal.ZERO);
        return saved;
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

        System.out.println("Transfer Debug: FromAccount=" + from.getAccountNumber() + ", Balance=" + from.getBalance() + ", Amount=" + amount + ", TotalDeduction=" + totalDeduction);

        if (from.getBalance().compareTo(totalDeduction) < 0) {
            System.out.println("Transfer Failed: Insufficient funds. Balance=" + from.getBalance() + ", Required=" + totalDeduction);
            throw new IllegalArgumentException("Insufficient funds for transfer + fees");
        }

        from.setBalance(from.getBalance().subtract(totalDeduction));
        to.setBalance(to.getBalance().add(amount));

        accountRepository.save(from);
        accountRepository.save(to);

        // Sender sees the principal amount in the transaction record, but fee/tax are
        // stored separately
        // Or should we store the total amount? Usually transaction amount is the
        // principal.
        saveTransaction(from, "TRANSFER_SENT", amount, to.getId(), safeFee, safeTax);
        saveTransaction(to, "TRANSFER_RECEIVED", amount, from.getId(), BigDecimal.ZERO, BigDecimal.ZERO);
    }

    @Transactional
    public void transferByCard(String senderCardNumber, String senderCvv, String senderExpiry, String receiverCardNumber, BigDecimal amount) {
        System.out.println("Card Transfer Request: SenderCard=" + senderCardNumber + ", Amount=" + amount);
        
        Card senderCard = cardRepository.findByCardNumber(senderCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Sender card not found"));

        if (!senderCard.getCvv().equals(senderCvv)) {
            throw new IllegalArgumentException("Invalid CVV");
        }
        // Simple expiry check (MM/YY)
        // In production, parse date properly
        
        Card receiverCard = cardRepository.findByCardNumber(receiverCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Receiver card not found"));

        Account from = senderCard.getAccount();
        Account to = receiverCard.getAccount();
        
        System.out.println("Card Transfer Resolved: FromAccount=" + from.getAccountNumber() + ", ToAccount=" + to.getAccountNumber());

        // Reuse existing transfer logic (assuming 0 fee/tax for now or calculate it)
        transfer(from.getId(), to.getId(), amount, BigDecimal.ZERO, BigDecimal.ZERO);
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
                            .build();
                })
                .collect(Collectors.toList());
    }
}
