package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.TransactionRequest;
import com.bankingapp.Server.dto.TransferRequest;
import com.bankingapp.Server.dto.TransactionResponse;
import com.bankingapp.Server.model.Account;
import com.bankingapp.Server.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<Account> deposit(@RequestBody TransactionRequest req) {
        Account updated = transactionService.deposit(req.getAccountId(), req.getAmount());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Account> withdraw(@RequestBody TransactionRequest req) {
        Account updated = transactionService.withdraw(req.getAccountId(), req.getAmount());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequest req) {
        transactionService.transfer(req.getFromAccountId(), req.getToAccountId(), req.getAmount());
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/account/{id}/history")
    public ResponseEntity<List<TransactionResponse>> history(@PathVariable("id") Long accountId) {
        // Get authenticated user's email from SecurityContext
        String userEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        return ResponseEntity.ok(transactionService.getTransactionsForAccount(accountId, userEmail));
    }
}
