package com.bankingapp.Server.dto;

import java.math.BigDecimal;

public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String ownerName;
    private BigDecimal balance;

    public AccountResponse() {
    }

    public AccountResponse(Long id, String accountNumber, String ownerName, BigDecimal balance) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public static AccountResponseBuilder builder() {
        return new AccountResponseBuilder();
    }

    public static class AccountResponseBuilder {
        private Long id;
        private String accountNumber;
        private String ownerName;
        private BigDecimal balance;

        AccountResponseBuilder() {
        }

        public AccountResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AccountResponseBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public AccountResponseBuilder ownerName(String ownerName) {
            this.ownerName = ownerName;
            return this;
        }

        public AccountResponseBuilder balance(BigDecimal balance) {
            this.balance = balance;
            return this;
        }

        public AccountResponse build() {
            return new AccountResponse(id, accountNumber, ownerName, balance);
        }

        public String toString() {
            return "AccountResponse.AccountResponseBuilder(id=" + this.id + ", accountNumber=" + this.accountNumber + ", ownerName=" + this.ownerName + ", balance=" + this.balance + ")";
        }
    }
}
