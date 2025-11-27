package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.CardResponse;
import com.bankingapp.Server.repository.CardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
// @RequestMapping("/api/cards") // Removed to allow mixed paths
public class CardController {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
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
    public ResponseEntity<List<CardResponse>> getUserCards(
            org.springframework.security.core.Authentication authentication) {
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
                        .cardName(card.getCardName())
                        .network(card.getNetwork())
                        .isPrimary(card.isPrimary())
                        .build())
                .collect(Collectors.toList());
        System.out.println("Returning cards for user " + email + ": " + cards.size());
        cards.forEach(c -> System.out
                .println("Card: " + c.getCardNumber() + ", Name: " + c.getCardName() + ", Network: " + c.getNetwork()));
        return ResponseEntity.ok(cards);

    }

    @GetMapping("/api/cards/all")
    public ResponseEntity<List<CardResponse>> getAllCards() {
        List<CardResponse> cards = cardRepository.findAll()
                .stream()
                .map(card -> CardResponse.builder()
                        .id(card.getId())
                        .cardNumber(card.getCardNumber())
                        .ownerName(card.getUser().getFullname())
                        .cardType(card.getCardType())
                        .expiryDate(card.getExpiryDate().toString())
                        .cvv(card.getCvv())
                        .status(card.getStatus())
                        .cardName(card.getCardName())
                        .network(card.getNetwork())
                        .isPrimary(card.isPrimary())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(cards);
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/cards/apply")
    public ResponseEntity<?> applyForCard(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> request) {
        String userIdStr = request.get("userId");
        String cardType = request.get("cardType");
        String network = request.get("network");
        String cardName = request.get("cardName");

        System.out.println("Applying for card: " + cardName + ", Type: " + cardType + ", Network: " + network);

        if (userIdStr == null || cardType == null || network == null || cardName == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Long userId = Long.parseLong(userIdStr);
        com.bankingapp.Server.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.bankingapp.Server.model.CardApplication application = new com.bankingapp.Server.model.CardApplication(user,
                cardType, network, cardName);

        // Check if user already has this card
        boolean alreadyHasCard = cardRepository.findByUser(user).stream()
                .anyMatch(c -> cardName.equals(c.getCardName()));
        if (alreadyHasCard) {
            return ResponseEntity.badRequest().body("You already own this card");
        }

        // Check if user has a pending application for this card
        boolean hasPendingApp = cardApplicationRepository.findByUser(user).stream()
                .anyMatch(app -> cardName.equals(app.getCardName()) && "PENDING".equals(app.getStatus()));
        if (hasPendingApp) {
            return ResponseEntity.badRequest().body("You already have a pending application for this card");
        }

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

        boolean isFirstCard = cardRepository.findByUser(user).isEmpty();

        com.bankingapp.Server.model.Card card = new com.bankingapp.Server.model.Card(cardNumber, expiryDate, cvv,
                application.getCardType(), "ACTIVE", application.getCardName(), application.getNetwork(), isFirstCard,
                null, user, account);
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

    @org.springframework.web.bind.annotation.PostMapping("/api/cards/{id}/primary")
    public ResponseEntity<?> setPrimaryCard(@org.springframework.web.bind.annotation.PathVariable Long id,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        com.bankingapp.Server.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.bankingapp.Server.model.Card targetCard = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!targetCard.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        List<com.bankingapp.Server.model.Card> userCards = cardRepository.findByUser(user);
        for (com.bankingapp.Server.model.Card card : userCards) {
            card.setPrimary(card.getId().equals(id));
            cardRepository.save(card);
        }

        return ResponseEntity.ok("Primary card updated");
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/cards/{id}/pin")
    public ResponseEntity<?> setCardPin(@org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> body,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        com.bankingapp.Server.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.bankingapp.Server.model.Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        String pin = body.get("pin");
        if (pin == null || pin.length() != 4) {
            return ResponseEntity.badRequest().body("Invalid PIN. Must be 4 digits.");
        }

        card.setPin(pin);
        cardRepository.save(card);

        return ResponseEntity.ok("PIN updated successfully");
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
