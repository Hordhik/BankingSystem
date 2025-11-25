package com.bankingapp.Server.dto;

import java.math.BigDecimal;

public class LoanApplyRequest {
    public Long userId;           // ideally extracted from JWT in controller
    public String loanType;
    public BigDecimal amount;
    public Integer tenureMonths;
}