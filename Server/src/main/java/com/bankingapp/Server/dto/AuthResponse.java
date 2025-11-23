package com.bankingapp.Server.dto;
public class AuthResponse {
    private String token;
    private String fullname;
    private String email;
    private String username;
    private String accountNumber;
    private Long primaryAccountId;
    private java.math.BigDecimal primaryAccountBalance;

    public AuthResponse() {}
    public AuthResponse(String token, String fullname, String email, String username, String accountNumber, Long primaryAccountId, java.math.BigDecimal primaryAccountBalance) {
        this.token = token;
        this.fullname = fullname;
        this.email = email;
        this.username = username;
        this.accountNumber = accountNumber;
        this.primaryAccountId = primaryAccountId;
        this.primaryAccountBalance = primaryAccountBalance;
    }
    public String getToken() { return token; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getAccountNumber() { return accountNumber; }
    public Long getPrimaryAccountId() { return primaryAccountId; }
    public java.math.BigDecimal getPrimaryAccountBalance() { return primaryAccountBalance; }
}
