package com.bankingapp.Server.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private String type;  // DEPOSIT, WITHDRAW, TRANSFER_SENT, TRANSFER_RECEIVED

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "counterparty_account_id")
    private Long counterpartyAccountId;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Transaction() {
    }

    public Transaction(Long id, Account account, String type, BigDecimal amount, Long counterpartyAccountId, String transactionId, LocalDateTime createdAt) {
        this.id = id;
        this.account = account;
        this.type = type;
        this.amount = amount;
        this.counterpartyAccountId = counterpartyAccountId;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getCounterpartyAccountId() {
        return counterpartyAccountId;
    }

    public void setCounterpartyAccountId(Long counterpartyAccountId) {
        this.counterpartyAccountId = counterpartyAccountId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public static class TransactionBuilder {
        private Long id;
        private Account account;
        private String type;
        private BigDecimal amount;
        private Long counterpartyAccountId;
        private String transactionId;
        private LocalDateTime createdAt;

        TransactionBuilder() {
        }

        public TransactionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionBuilder account(Account account) {
            this.account = account;
            return this;
        }

        public TransactionBuilder type(String type) {
            this.type = type;
            return this;
        }

        public TransactionBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public TransactionBuilder counterpartyAccountId(Long counterpartyAccountId) {
            this.counterpartyAccountId = counterpartyAccountId;
            return this;
        }

        public TransactionBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public TransactionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Transaction build() {
            return new Transaction(id, account, type, amount, counterpartyAccountId, transactionId, createdAt);
        }

        public String toString() {
            return "Transaction.TransactionBuilder(id=" + this.id + ", account=" + this.account + ", type=" + this.type + ", amount=" + this.amount + ", counterpartyAccountId=" + this.counterpartyAccountId + ", transactionId=" + this.transactionId + ", createdAt=" + this.createdAt + ")";
        }
    }
}
