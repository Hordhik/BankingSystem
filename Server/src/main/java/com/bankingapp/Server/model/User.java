package com.bankingapp.Server.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "fullname", nullable = false)
    private String fullname;
    @Column(name = "username", unique = true)         // added
    private String username;
    @Column(name = "account_number")                  // added
    private String accountNumber;
    @Column(name = "ifsc_code")                       // added
    private String ifscCode;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    public User() {}
    // constructor including the new fields
    public User(String fullname, String username, String accountNumber, String ifscCode, String email, String password) {
        this.fullname = fullname;
        this.username = username;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.createdAt = LocalDateTime.now();
    }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
