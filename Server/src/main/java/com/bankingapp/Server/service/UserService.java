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

    public UserService(UserRepository userRepository, AccountRepository accountRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.jwtUtil = jwtUtil;
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
                account.getId(),
                account.getBalance()
        );
    }
}
