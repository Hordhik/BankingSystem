package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Transaction;
import com.bankingapp.Server.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);

    List<Transaction> findTop5ByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Transaction t JOIN FETCH t.account a JOIN FETCH a.user ORDER BY t.createdAt DESC")
    List<Transaction> findAllWithDetails();
}
