package com.bankingapp.Server.service;

import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.Transaction;
import com.bankingapp.Server.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionLoggingService {

    private final TransactionRepository transactionRepository;

    public TransactionLoggingService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveTransaction(Account account, String type, BigDecimal amount, Long counterpartyAccountId,
                                BigDecimal fee, BigDecimal tax, String status) {
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
                .status(status)
                .build();
        transactionRepository.save(tx);
    }
}
