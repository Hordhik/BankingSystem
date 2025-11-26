package com.bankingapp.Server.dto;

import java.math.BigDecimal;

public class LoanApplyRequest {
    public Long userId;
    public String accountNumber;
    public String loanType;
    public BigDecimal principalAmount;
    public Integer tenureMonths;
}
