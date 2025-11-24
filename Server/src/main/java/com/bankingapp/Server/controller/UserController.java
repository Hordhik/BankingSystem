package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.AuthResponse;
import com.bankingapp.Server.dto.UpdateUserRequest;
import com.bankingapp.Server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }
}
