package com.bankingapp.Server.model;

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

	@Column(nullable = false, length = 20)
	private String type;

	@Column(nullable = false, precision = 18, scale = 2)
	private BigDecimal amount;

	private String description;

	@Column(nullable = false, length = 20)
	private String status;

	@Column(nullable = false)
	private Instant date;

	@PrePersist
	public void prePersist() {
		if (date == null) date = Instant.now();
		if (status == null) status = "PENDING";
	}
}
