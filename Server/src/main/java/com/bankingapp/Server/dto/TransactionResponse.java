package com.bankingapp.Server.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String type;
    private BigDecimal amount;
    private Long accountId;
    private Long counterpartyAccountId;
    private String counterpartyName;
    private String transactionId;
    private LocalDateTime createdAt;
    private BigDecimal fee;
    private BigDecimal tax;

    public TransactionResponse() {
    }

    public TransactionResponse(Long id, String type, BigDecimal amount, Long accountId, Long counterpartyAccountId,
            String counterpartyName, String transactionId, LocalDateTime createdAt, BigDecimal fee, BigDecimal tax) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.accountId = accountId;
        this.counterpartyAccountId = counterpartyAccountId;
        this.counterpartyName = counterpartyName;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
        this.fee = fee;
        this.tax = tax;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getCounterpartyAccountId() {
        return counterpartyAccountId;
    }

    public void setCounterpartyAccountId(Long counterpartyAccountId) {
        this.counterpartyAccountId = counterpartyAccountId;
    }

    public String getCounterpartyName() {
        return counterpartyName;
    }

    public void setCounterpartyName(String counterpartyName) {
        this.counterpartyName = counterpartyName;
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

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public static TransactionResponseBuilder builder() {
        return new TransactionResponseBuilder();
    }

    public static class TransactionResponseBuilder {
        private Long id;
        private String type;
        private BigDecimal amount;
        private Long accountId;
        private Long counterpartyAccountId;
        private String counterpartyName;
        private String transactionId;
        private LocalDateTime createdAt;
        private BigDecimal fee;
        private BigDecimal tax;

        TransactionResponseBuilder() {
        }

        public TransactionResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public TransactionResponseBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public TransactionResponseBuilder accountId(Long accountId) {
            this.accountId = accountId;
            return this;
        }

        public TransactionResponseBuilder counterpartyAccountId(Long counterpartyAccountId) {
            this.counterpartyAccountId = counterpartyAccountId;
            return this;
        }

        public TransactionResponseBuilder counterpartyName(String counterpartyName) {
            this.counterpartyName = counterpartyName;
            return this;
        }

        public TransactionResponseBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public TransactionResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TransactionResponseBuilder fee(BigDecimal fee) {
            this.fee = fee;
            return this;
        }

        public TransactionResponseBuilder tax(BigDecimal tax) {
            this.tax = tax;
            return this;
        }

        public TransactionResponse build() {
            return new TransactionResponse(id, type, amount, accountId, counterpartyAccountId, counterpartyName,
                    transactionId, createdAt, fee, tax);
        }

        public String toString() {
            return "TransactionResponse.TransactionResponseBuilder(id=" + this.id + ", type=" + this.type + ", amount="
                    + this.amount + ", accountId=" + this.accountId + ", counterpartyAccountId="
                    + this.counterpartyAccountId + ", counterpartyName=" + this.counterpartyName + ", transactionId="
                    + this.transactionId + ", createdAt=" + this.createdAt + ", fee=" + this.fee + ", tax=" + this.tax
                    + ")";
        }
    }
}
