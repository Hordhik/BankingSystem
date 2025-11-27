package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.CardApplication;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardApplicationRepository extends JpaRepository<CardApplication, Long> {
    List<CardApplication> findByUser(User user);
    List<CardApplication> findByStatus(String status);
}
