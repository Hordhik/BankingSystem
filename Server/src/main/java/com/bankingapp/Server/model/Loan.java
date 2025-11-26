package com.bankingapp.Server.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "loan_type", nullable = false)
    private String loanType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principalAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "monthly_emi", precision = 15, scale = 2)
    private BigDecimal monthlyEmi;

    @Column(name = "total_interest", precision = 15, scale = 2)
    private BigDecimal totalInterest;

    @Column(name = "total_payable", precision = 15, scale = 2)
    private BigDecimal totalPayable;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    @Column(name = "admin_reason", columnDefinition = "TEXT")
    private String adminReason;

    @Column(name = "next_payment")
    private String nextPayment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) status = LoanStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // Getters & Setters...

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getAccountNumber() { return accountNumber; }
    public String getLoanType() { return loanType; }
    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public Integer getTenureMonths() { return tenureMonths; }
    public BigDecimal getInterestRate() { return interestRate; }
    public BigDecimal getMonthlyEmi() { return monthlyEmi; }
    public BigDecimal getTotalInterest() { return totalInterest; }
    public BigDecimal getTotalPayable() { return totalPayable; }
    public String getDetails() { return details; }
    public LoanStatus getStatus() { return status; }
    public String getAdminReason() { return adminReason; }
    public String getNextPayment() { return nextPayment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setMonthlyEmi(BigDecimal monthlyEmi) { this.monthlyEmi = monthlyEmi; }
    public void setTotalInterest(BigDecimal totalInterest) { this.totalInterest = totalInterest; }
    public void setTotalPayable(BigDecimal totalPayable) { this.totalPayable = totalPayable; }
    public void setDetails(String details) { this.details = details; }
    public void setStatus(LoanStatus status) { this.status = status; }
    public void setAdminReason(String adminReason) { this.adminReason = adminReason; }
    public void setNextPayment(String nextPayment) { this.nextPayment = nextPayment; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
