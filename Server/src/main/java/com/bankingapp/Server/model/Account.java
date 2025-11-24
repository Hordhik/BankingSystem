package com.bankingapp.Server.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_type", nullable = false)
    private String accountType;

    @Column(name = "balance", nullable = false, precision = 18, scale = 2)
    private BigDecimal balance;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Account() {
    }

    public Account(Long id, String accountNumber, String accountType, BigDecimal balance, LocalDateTime createdAt, String currency, User user) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.createdAt = createdAt;
        this.currency = currency;
        this.user = user;
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

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public static AccountBuilder builder() {
        return new AccountBuilder();
    }

    public static class AccountBuilder {
        private Long id;
        private String accountNumber;
        private String accountType;
        private BigDecimal balance;
        private LocalDateTime createdAt;
        private String currency;
        private User user;

        AccountBuilder() {
        }

        public AccountBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AccountBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public AccountBuilder accountType(String accountType) {
            this.accountType = accountType;
            return this;
        }

        public AccountBuilder balance(BigDecimal balance) {
            this.balance = balance;
            return this;
        }

        public AccountBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AccountBuilder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public AccountBuilder user(User user) {
            this.user = user;
            return this;
        }

        public Account build() {
            return new Account(id, accountNumber, accountType, balance, createdAt, currency, user);
        }

        public String toString() {
            return "Account.AccountBuilder(id=" + this.id + ", accountNumber=" + this.accountNumber + ", accountType=" + this.accountType + ", balance=" + this.balance + ", createdAt=" + this.createdAt + ", currency=" + this.currency + ", user=" + this.user + ")";
        }
    }
}
