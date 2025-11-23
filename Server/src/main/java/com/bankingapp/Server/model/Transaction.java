package com.bankingapp.Server.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private String type;  // DEPOSIT, WITHDRAW, TRANSFER_SENT, TRANSFER_RECEIVED

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "counterparty_account_id")
    private Long counterpartyAccountId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
