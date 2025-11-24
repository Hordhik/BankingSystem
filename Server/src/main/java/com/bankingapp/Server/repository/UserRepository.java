package com.bankingapp.Server.repository;
import com.bankingapp.Server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
}
