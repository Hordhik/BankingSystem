package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Bill;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
	List<Bill> findByUser(User user);
	List<Bill> findByDueDateBeforeAndUser(LocalDate date, User user);
}
