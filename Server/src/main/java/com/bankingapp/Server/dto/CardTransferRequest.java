package com.bankingapp.Server.dto;

import java.math.BigDecimal;

public class CardTransferRequest {
    private String senderCardNumber;
    private String senderCvv;
    private String senderExpiryDate; // MM/YY
    private String receiverCardNumber;
    private BigDecimal amount;

    public String getSenderCardNumber() {
        return senderCardNumber;
    }

    public void setSenderCardNumber(String senderCardNumber) {
        this.senderCardNumber = senderCardNumber;
    }

    public String getSenderCvv() {
        return senderCvv;
    }

    public void setSenderCvv(String senderCvv) {
        this.senderCvv = senderCvv;
    }

    public String getSenderExpiryDate() {
        return senderExpiryDate;
    }

    public void setSenderExpiryDate(String senderExpiryDate) {
        this.senderExpiryDate = senderExpiryDate;
    }

    public String getReceiverCardNumber() {
        return receiverCardNumber;
    }

    public void setReceiverCardNumber(String receiverCardNumber) {
        this.receiverCardNumber = receiverCardNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
