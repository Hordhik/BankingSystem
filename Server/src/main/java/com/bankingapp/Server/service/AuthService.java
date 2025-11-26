package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.*;
import com.bankingapp.Server.model.User;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.repository.AccountRepository;
import com.bankingapp.Server.repository.UserRepository;
import com.bankingapp.Server.repository.CardRepository;
import com.bankingapp.Server.model.Card;
import com.bankingapp.Server.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder encoder;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil,
            org.springframework.security.crypto.password.PasswordEncoder encoder, AccountRepository accountRepository, CardRepository cardRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
        this.accountRepository = accountRepository;
        this.cardRepository = cardRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse register(RegisterRequest req) {
        if (isBlank(req.getEmail()) || isBlank(req.getPassword()) || isBlank(req.getFullname())) {
            throw new IllegalArgumentException("Full name, email and password are required");
        }

        String email = req.getEmail().trim().toLowerCase();

        // Allow optional accountNumber; if absent generate one
        String acctNumber = isBlank(req.getAccountNumber()) ? generateAccountNumber() : req.getAccountNumber().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        if (!isBlank(req.getAccountNumber()) && userRepository.existsByAccountNumber(req.getAccountNumber().trim())) {
            throw new RuntimeException("Account number already exists");
        }

        User user = new User(
                req.getFullname().trim(),
                email,
                encoder.encode(req.getPassword()),
                isBlank(req.getUsername()) ? generateUsername(req.getFullname()) : req.getUsername().trim(),
                acctNumber,
                isBlank(req.getIfsc()) ? "SBIN000000" : req.getIfsc().trim().toUpperCase());
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

        // Generate and save Card
        String cardNumber = generateCardNumber();
        String cvv = String.format("%03d", (int) (Math.random() * 1000));
        java.time.LocalDate expiryDate = java.time.LocalDate.now().plusYears(5);

        Card card = new Card(cardNumber, expiryDate, cvv, "DEBIT", "ACTIVE", user, account);
        cardRepository.save(card);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getUserId(), user.getFullname(), user.getEmail(), user.getUsername(),
                user.getAccountNumber(), card.getCardNumber(), card.getCvv(), card.getExpiryDate().toString(), account.getId(), account.getBalance());
    }

    public AuthResponse login(LoginRequest req) {
        String identifier = req.getIdentifier();
        if (isBlank(identifier)) {
            // Fallback to email if identifier is missing (backward compatibility)
            identifier = req.getEmail();
        }

        if (isBlank(identifier)) {
            throw new IllegalArgumentException("Email or Username is required");
        }

        String finalIdentifier = identifier.trim();

        // Try to find user by email or username
        User user = userRepository.findByEmailOrUsername(finalIdentifier, finalIdentifier)
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

        Card card = cardRepository.findByUser(user).orElseGet(() -> {
            // Generate new card for existing users who don't have one
            String cardNumber = generateCardNumber();
            String cvv = String.format("%03d", (int) (Math.random() * 1000));
            java.time.LocalDate expiryDate = java.time.LocalDate.now().plusYears(5);
            Card newCard = new Card(cardNumber, expiryDate, cvv, "DEBIT", "ACTIVE", user, account);
            return cardRepository.save(newCard);
        });

        String cNum = card.getCardNumber();
        String cCvv = card.getCvv();
        String cExp = card.getExpiryDate().toString();

        return new AuthResponse(token, user.getUserId(), user.getFullname(), user.getEmail(), user.getUsername(),
                user.getAccountNumber(), cNum, cCvv, cExp, account.getId(), account.getBalance());
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String generateUsername(String fullname) {
        String base = fullname.replaceAll("\\s+", " ").split(" ")[0].toLowerCase();
        return base.length() > 12 ? base.substring(0, 12) : base + (int) (Math.random() * 90 + 10);
    }

    private String generateAccountNumber() {
        // Simple 10-digit random; in production ensure uniqueness via loop
        String num;
        do {
            num = String.valueOf((long) (Math.random() * 9000000000L) + 1000000000L);
        } while (userRepository.existsByAccountNumber(num));
        return num;
    }

    private String generateCardNumber() {
        // Simple 16-digit random; in production ensure uniqueness
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            sb.append((int) (Math.random() * 10));
        }
        String num = sb.toString();
        if (cardRepository.findByCardNumber(num).isPresent()) {
            return generateCardNumber(); // retry
        }
        return num;
    }
}
