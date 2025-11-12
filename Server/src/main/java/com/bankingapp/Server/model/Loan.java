package com.bankingapp.Server.model;

import com.bankingapp.Server.model.enums.LoanStatus;
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
@Table(name = "loans")
public class Loan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long loanId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String loanType;

	@Column(nullable = false, precision = 18, scale = 2)
	private BigDecimal amount;

	@Column(nullable = false, precision = 5, scale = 2)
	private BigDecimal interestRate;

	@Column(nullable = false)
	private LocalDate startDate;

	private LocalDate endDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private LoanStatus status = LoanStatus.PENDING;
}
