package com.bankingapp.Server.dto;
public class AuthResponse {
    private String token;
    private String fullname;
    private String email;
    public AuthResponse() {}
    public AuthResponse(String token, String fullname, String email) {
        this.token = token;
        this.fullname = fullname;
        this.email = email;
    }
    public String getToken() { return token; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
}
