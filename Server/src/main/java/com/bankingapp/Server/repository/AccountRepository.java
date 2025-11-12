package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
	Optional<Account> findByAccountNumber(String accountNumber);
	List<Account> findByUser(User user);
}
