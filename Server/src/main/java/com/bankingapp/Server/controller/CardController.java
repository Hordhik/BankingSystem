package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.CardResponse;
import com.bankingapp.Server.repository.CardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardRepository cardRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");

    public CardController(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @GetMapping
    public ResponseEntity<List<CardResponse>> getAllCards() {
        List<CardResponse> cards = cardRepository.findAll()
                .stream()
                .map(card -> CardResponse.builder()
                        .id(card.getId())
                        .cardNumber(card.getCardNumber())
                        .ownerName(card.getUser().getFullname())
                        .cardType(card.getCardType())
                        .expiryDate(card.getExpiryDate().format(formatter))
                        .cvv(card.getCvv())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(cards);
    }
}
