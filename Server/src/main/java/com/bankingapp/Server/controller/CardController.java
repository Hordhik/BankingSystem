package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.CardResponse;
import com.bankingapp.Server.repository.CardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
//@RequestMapping("/api/cards") // Removed to allow mixed paths
public class CardController {

    private final com.bankingapp.Server.repository.CardRepository cardRepository;
    private final com.bankingapp.Server.repository.CardApplicationRepository cardApplicationRepository;
    private final com.bankingapp.Server.repository.UserRepository userRepository;
    private final com.bankingapp.Server.repository.AccountRepository accountRepository;

    public CardController(com.bankingapp.Server.repository.CardRepository cardRepository,
                          com.bankingapp.Server.repository.CardApplicationRepository cardApplicationRepository,
                          com.bankingapp.Server.repository.UserRepository userRepository,
                          com.bankingapp.Server.repository.AccountRepository accountRepository) {
        this.cardRepository = cardRepository;
        this.cardApplicationRepository = cardApplicationRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @GetMapping("/api/cards")
    public ResponseEntity<List<CardResponse>> getUserCards(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        com.bankingapp.Server.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CardResponse> cards = cardRepository.findByUser(user)
                .stream()
                .map(card -> CardResponse.builder()
                        .id(card.getId())
                        .cardNumber(card.getCardNumber())
                        .ownerName(card.getUser().getFullname())
                        .cardType(card.getCardType())
                        .expiryDate(card.getExpiryDate().toString())
                        .cvv(card.getCvv())
                        .status(card.getStatus())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(cards);
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/cards/apply")
    public ResponseEntity<?> applyForCard(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> request) {
        String userIdStr = request.get("userId");
        String cardType = request.get("cardType");
        String network = request.get("network");

        if (userIdStr == null || cardType == null || network == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Long userId = Long.parseLong(userIdStr);
        com.bankingapp.Server.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.bankingapp.Server.model.CardApplication application = new com.bankingapp.Server.model.CardApplication(user, cardType, network);
        cardApplicationRepository.save(application);

        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/api/admin/cards/applications")
    public ResponseEntity<List<com.bankingapp.Server.model.CardApplication>> getAllApplications() {
        return ResponseEntity.ok(cardApplicationRepository.findAll());
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/admin/cards/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(@org.springframework.web.bind.annotation.PathVariable Long id) {
        com.bankingapp.Server.model.CardApplication application = cardApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"PENDING".equals(application.getStatus())) {
            return ResponseEntity.badRequest().body("Application is not pending");
        }

        // Create new Card
        com.bankingapp.Server.model.User user = application.getUser();
        com.bankingapp.Server.model.Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User has no account")); // Should ideally select account

        String cardNumber = generateCardNumber();
        String cvv = String.format("%03d", (int) (Math.random() * 1000));
        java.time.LocalDate expiryDate = java.time.LocalDate.now().plusYears(5);

        com.bankingapp.Server.model.Card card = new com.bankingapp.Server.model.Card(cardNumber, expiryDate, cvv, application.getCardType(), "ACTIVE", user, account);
        cardRepository.save(card);

        // Update Application Status
        application.setStatus("APPROVED");
        cardApplicationRepository.save(application);

        return ResponseEntity.ok("Application approved and card created");
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/admin/cards/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(@org.springframework.web.bind.annotation.PathVariable Long id) {
        com.bankingapp.Server.model.CardApplication application = cardApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"PENDING".equals(application.getStatus())) {
            return ResponseEntity.badRequest().body("Application is not pending");
        }

        application.setStatus("REJECTED");
        cardApplicationRepository.save(application);

        return ResponseEntity.ok("Application rejected");
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
