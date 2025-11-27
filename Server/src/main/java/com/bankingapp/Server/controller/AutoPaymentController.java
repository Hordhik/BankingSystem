package com.bankingapp.Server.controller;

import com.bankingapp.Server.service.LoanService;
import com.bankingapp.Server.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/autopayments")
public class AutoPaymentController {

    private final LoanService loanService;
    private final TransactionService transactionService;

    public AutoPaymentController(LoanService loanService, TransactionService transactionService) {
        this.loanService = loanService;
        this.transactionService = transactionService;
    }

    @PostMapping("/process/{userId}")
    public ResponseEntity<String> processAutopayment(@PathVariable Long userId) {
        try {
            BigDecimal totalEmi = loanService.calculateTotalEmi(userId);
            if (totalEmi.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("No active loans or EMI due.");
            }

            transactionService.processAutopayment(userId, totalEmi);
            return ResponseEntity.ok("Autopayment processed successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Autopayment failed: " + e.getMessage());
        }
    }
}
