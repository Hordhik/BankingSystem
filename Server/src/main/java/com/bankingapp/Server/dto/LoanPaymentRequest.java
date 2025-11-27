package com.bankingapp.Server.dto;

import java.math.BigDecimal;

public class LoanPaymentRequest {
    public Long userId;
    public Long accountId;
    public BigDecimal amount;
    public String loanType;
}
