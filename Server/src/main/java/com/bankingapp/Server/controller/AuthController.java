package com.bankingapp.Server.controller;
import com.bankingapp.Server.dto.*;
import com.bankingapp.Server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        // quick debug log - will print request fields to console
        System.out.println("REGISTER REQUEST -> fullname: " + req.getFullname()
                + " | email: " + req.getEmail()
                + " | username: " + req.getUsername()
                + " | accountNumber: " + req.getAccountNumber()
                + " | ifsc: " + req.getIfsc());
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
