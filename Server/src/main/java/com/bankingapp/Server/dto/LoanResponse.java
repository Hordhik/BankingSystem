package com.bankingapp.Server.dto;

import com.bankingapp.Server.model.LoanStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanResponse {
    public Long id;
    public Long userId;
    public String loanType;
    public BigDecimal amount;
    public Integer tenureMonths;
    public LoanStatus status;
    public String adminReason;
    public String nextPayment;
    public LocalDateTime createdAt;
}
