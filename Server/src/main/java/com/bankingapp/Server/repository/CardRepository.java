package com.bankingapp.Server.repository;

import com.bankingapp.Server.model.Card;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByCardNumber(String cardNumber);
    java.util.List<Card> findByUser(User user);
}
