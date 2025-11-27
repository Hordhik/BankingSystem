package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUser(User user);
    boolean existsByAccountNumber(String accountNumber);
}
