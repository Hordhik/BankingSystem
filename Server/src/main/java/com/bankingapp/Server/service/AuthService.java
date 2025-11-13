package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.*;
import com.bankingapp.Server.model.User;
import com.bankingapp.Server.repository.UserRepository;
import com.bankingapp.Server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // create user with additional fields
        User user = new User(
                req.getFullname(),
                req.getEmail(),
                encoder.encode(req.getPassword()),
                req.getUsername(),
                req.getAccountNumber(),
                req.getIfsc()
        );

        // If you prefer to set fields via setters instead of constructor:
        // user.setUsername(req.getUsername());
        // user.setAccountNumber(req.getAccountNumber());
        // user.setIfscCode(req.getIfsc());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullname(), user.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getFullname(), user.getEmail());
    }
}
