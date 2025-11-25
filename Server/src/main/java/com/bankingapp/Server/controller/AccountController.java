package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.AccountResponse;
import com.bankingapp.Server.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountRepository accountRepository;

    public AccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<AccountResponse> accounts = accountRepository.findAll()
                .stream()
                .map(account -> AccountResponse.builder()
                        .id(account.getId())
                        .accountNumber(account.getAccountNumber())
                        .ownerName(account.getUser().getFullname())
                        .balance(account.getBalance())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }
}
