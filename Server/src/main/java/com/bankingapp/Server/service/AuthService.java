package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.*;
import com.bankingapp.Server.model.User;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.repository.AccountRepository;
import com.bankingapp.Server.repository.UserRepository;
import com.bankingapp.Server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder encoder;
    private final AccountRepository accountRepository;

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse register(RegisterRequest req) {
        if (isBlank(req.getEmail()) || isBlank(req.getPassword()) || isBlank(req.getFullname())) {
            throw new IllegalArgumentException("Full name, email and password are required");
        }
        // Allow optional accountNumber; if absent generate one
        String acctNumber = isBlank(req.getAccountNumber()) ? generateAccountNumber() : req.getAccountNumber().trim();
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (!isBlank(req.getAccountNumber()) && userRepository.existsByAccountNumber(req.getAccountNumber().trim())) {
            throw new RuntimeException("Account number already exists");
        }

        User user = new User(
            req.getFullname().trim(),
            req.getEmail().trim().toLowerCase(),
            encoder.encode(req.getPassword()),
            isBlank(req.getUsername()) ? generateUsername(req.getFullname()) : req.getUsername().trim(),
            acctNumber,
            isBlank(req.getIfsc()) ? "SBIN000000" : req.getIfsc().trim().toUpperCase()
        );
        userRepository.save(user);

        // create primary savings account with opening balance 10000.00
        Account account = Account.builder()
            .accountNumber(acctNumber)
            .accountType("SAVINGS")
            .balance(new java.math.BigDecimal("10000.00"))
            .createdAt(java.time.LocalDateTime.now())
            .currency("INR")
            .user(user)
            .build();
        accountRepository.save(account); // persist primary account

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getUserId(), user.getFullname(), user.getEmail(), user.getUsername(), user.getAccountNumber(), account.getId(), account.getBalance());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().trim();
        // Try exact match first, then ignore case
        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findByEmailIgnoreCase(email))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        // ensure account exists (lazy creation if absent)
        Account account = accountRepository.findByUser(user)
            .orElseGet(() -> {
                    Account created = Account.builder()
                        .accountNumber(user.getAccountNumber())
                        .accountType("SAVINGS")
                        .balance(new java.math.BigDecimal("10000.00"))
                        .createdAt(java.time.LocalDateTime.now())
                        .currency("INR")
                        .user(user)
                        .build();
                return accountRepository.save(created);
            });
        return new AuthResponse(token, user.getUserId(), user.getFullname(), user.getEmail(), user.getUsername(), user.getAccountNumber(), account.getId(), account.getBalance());
    }

    private boolean isBlank(String s){ return s == null || s.trim().isEmpty(); }
    private String generateUsername(String fullname){
        String base = fullname.replaceAll("\\s+"," ").split(" ")[0].toLowerCase();
        return base.length()>12? base.substring(0,12): base + (int)(Math.random()*90+10);
    }
    private String generateAccountNumber(){
        // Simple 10-digit random; in production ensure uniqueness via loop
        String num;
        do {
            num = String.valueOf((long)(Math.random()*9000000000L)+1000000000L);
        } while (userRepository.existsByAccountNumber(num));
        return num;
    }
}
