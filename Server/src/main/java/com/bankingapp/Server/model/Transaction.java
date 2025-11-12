package com.bankingapp.Server.model;

import com.bankingapp.Server.model.enums.TransactionStatus;
import com.bankingapp.Server.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long transactionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id", nullable = false)
	private Account account;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransactionType type;

	@Column(nullable = false, precision = 18, scale = 2)
	private BigDecimal amount;

	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private TransactionStatus status = TransactionStatus.PENDING;

	@Column(nullable = false)
	private Instant date;

	@PrePersist
	public void prePersist() {
		if (date == null) date = Instant.now();
	}
}
