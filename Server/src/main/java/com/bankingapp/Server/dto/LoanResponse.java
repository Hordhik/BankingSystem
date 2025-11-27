package com.bankingapp.Server.dto;

public class LoanResponse {
    private Long id;
    private Long userId;
    private String accountNumber;
    private String loanType;
    private String status;
    private String principalAmount;
    private String tenure;
    private String monthlyEmi;
    private String totalInterest;
    private String totalPayable;
    private String details;
    private String adminReason;
    private Integer emisPaid;
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(String principalAmount) { this.principalAmount = principalAmount; }

    public String getTenure() { return tenure; }
    public void setTenure(String tenure) { this.tenure = tenure; }

    public String getMonthlyEmi() { return monthlyEmi; }
    public void setMonthlyEmi(String monthlyEmi) { this.monthlyEmi = monthlyEmi; }

    public String getTotalInterest() { return totalInterest; }
    public void setTotalInterest(String totalInterest) { this.totalInterest = totalInterest; }

    public String getTotalPayable() { return totalPayable; }
    public void setTotalPayable(String totalPayable) { this.totalPayable = totalPayable; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getAdminReason() { return adminReason; }
    public void setAdminReason(String adminReason) { this.adminReason = adminReason; }

    public Integer getEmisPaid() { return emisPaid; }
    public void setEmisPaid(Integer emisPaid) { this.emisPaid = emisPaid; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
