package com.bankingapp.Server.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private String type;
    private BigDecimal amount;
    private Long accountId;
    private Long counterpartyAccountId;
    private String counterpartyName;
    private String transactionId;
    private LocalDateTime createdAt;
}
