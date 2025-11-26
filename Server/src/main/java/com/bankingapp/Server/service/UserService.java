package com.bankingapp.Server.service;

import com.bankingapp.Server.dto.AuthResponse;
import com.bankingapp.Server.dto.UpdateUserRequest;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.model.User;
import com.bankingapp.Server.repository.AccountRepository;
import com.bankingapp.Server.repository.UserRepository;
import com.bankingapp.Server.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final JwtUtil jwtUtil;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AccountRepository accountRepository, JwtUtil jwtUtil,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullname() != null && !request.getFullname().isEmpty()) {
            user.setFullname(request.getFullname());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername().trim());
        }

        User updatedUser = userRepository.save(user);
        String newToken = jwtUtil.generateToken(updatedUser.getEmail());

        Account account = accountRepository.findByUser(updatedUser)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return new AuthResponse(
                newToken,
                updatedUser.getUserId(),
                updatedUser.getFullname(),
                updatedUser.getEmail(),
                updatedUser.getUsername(),
                updatedUser.getAccountNumber(),
                null, null, null,
                account.getId(),
                account.getBalance());
    }

    public void changePassword(Long userId, com.bankingapp.Server.dto.ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
