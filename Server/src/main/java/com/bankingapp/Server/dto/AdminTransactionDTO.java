package com.bankingapp.Server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminTransactionDTO {
    private Long id;
    private String from;
    private String to;
    private String amount;
    private String type;
    private String date;
    private String status;
}
