package com.bankingapp.Server.dto;

public class CardResponse {
    private Long id;
    private String cardNumber;
    private String ownerName;
    private String cardType;

    public CardResponse() {
    }

    public CardResponse(Long id, String cardNumber, String ownerName, String cardType) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.ownerName = ownerName;
        this.cardType = cardType;
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

    public static CardResponseBuilder builder() {
        return new CardResponseBuilder();
    }

    public static class CardResponseBuilder {
        private Long id;
        private String cardNumber;
        private String ownerName;
        private String cardType;

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

        public CardResponse build() {
            return new CardResponse(id, cardNumber, ownerName, cardType);
        }
    }
}
