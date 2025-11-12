package com.bankingapp.Server.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "accounts", indexes = {
		@Index(name = "idx_accounts_number", columnList = "accountNumber", unique = true)
})
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long accountId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false, length = 20)
	private String accountType;

	@Column(nullable = false, unique = true, length = 24)
	private String accountNumber;

	@Column(nullable = false, precision = 18, scale = 2)
	@Builder.Default
	private BigDecimal balance = BigDecimal.ZERO;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	@PrePersist
	public void prePersist() {
		if (createdAt == null) createdAt = Instant.now();
	}

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Transaction> transactions = new ArrayList<>();
}
