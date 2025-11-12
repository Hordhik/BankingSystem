package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Loan;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
	List<Loan> findByUser(User user);
}
