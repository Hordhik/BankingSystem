package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByAccountOrderByDateDesc(Account account);
}
