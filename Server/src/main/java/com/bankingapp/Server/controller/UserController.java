package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.AuthResponse;
import com.bankingapp.Server.dto.UpdateUserRequest;
import com.bankingapp.Server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<String> changePassword(@PathVariable Long userId,
            @RequestBody com.bankingapp.Server.dto.ChangePasswordRequest request) {
        userService.changePassword(userId, request);
        return ResponseEntity.ok("Password updated successfully");
    }
}
