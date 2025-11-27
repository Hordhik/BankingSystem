package com.bankingapp.Server.dto;

public class CardResponse {
    private Long id;
    private String cardNumber;
    private String ownerName;
    private String cardType;
    private String expiryDate;
    private String cvv;


    private String status;

    public CardResponse() {
    }

    public CardResponse(Long id, String cardNumber, String ownerName, String cardType, String expiryDate, String cvv, String status) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.ownerName = ownerName;
        this.cardType = cardType;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static CardResponseBuilder builder() {
        return new CardResponseBuilder();
    }

    public static class CardResponseBuilder {
        private Long id;
        private String cardNumber;
        private String ownerName;
        private String cardType;
        private String expiryDate;
        private String cvv;
        private String status;

        CardResponseBuilder() {
        }

        public CardResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CardResponseBuilder cardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
            return this;
        }

        public CardResponseBuilder ownerName(String ownerName) {
            this.ownerName = ownerName;
            return this;
        }

        public CardResponseBuilder cardType(String cardType) {
            this.cardType = cardType;
            return this;
        }

        public CardResponseBuilder expiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public CardResponseBuilder cvv(String cvv) {
            this.cvv = cvv;
            return this;
        }

        public CardResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public CardResponse build() {
            return new CardResponse(id, cardNumber, ownerName, cardType, expiryDate, cvv, status);
        }
    }
}
