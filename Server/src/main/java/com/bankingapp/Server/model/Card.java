package com.bankingapp.Server.model;

import com.bankingapp.Server.model.enums.CardType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cards", indexes = {
		@Index(name = "idx_cards_card_number", columnList = "cardNumber", unique = true)
})
public class Card {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cardId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false, unique = true, length = 20)
	private String cardNumber;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CardType type;

	@Column(nullable = false, length = 4)
	private String cvv;

	@Column(nullable = false)
	private LocalDate expiryDate;

	@Column(precision = 18, scale = 2)
	private BigDecimal dailyLimit;

	@Column(precision = 18, scale = 2)
	private BigDecimal onlineLimit;
}
