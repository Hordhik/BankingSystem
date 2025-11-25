package com.bankingapp.Server.controller;

import com.bankingapp.Server.model.Loan;
import com.bankingapp.Server.dto.AdminDecisionRequest;
import com.bankingapp.Server.dto.LoanApplyRequest;
import com.bankingapp.Server.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService service;

    public LoanController(LoanService service) {
        this.service = service;
    }

    // User applies for loan
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LoanApplyRequest req, @RequestHeader("Authorization") String auth) {
        // NOTE: For production, extract userId from JWT instead of trusting req.userId
        Loan loan = new Loan();
        loan.setUserId(req.userId);
        loan.setLoanType(req.loanType);
        loan.setAmount(req.amount);
        loan.setTenureMonths(req.tenureMonths);

        Loan saved = service.applyLoan(loan);
        return ResponseEntity.ok(saved);
    }

    // Get loans for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Loan>> getUserLoans(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getLoansForUser(userId));
    }

    // Admin: get all loans (filtering/pagination can be added)
    @GetMapping
    public ResponseEntity<List<Loan>> getAll() {
        return ResponseEntity.ok(service.getAllLoans());
    }

    // Admin approves
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        Loan updated = service.approveLoan(id);
        return ResponseEntity.ok(updated);
    }

    // Admin rejects (with reason)
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody AdminDecisionRequest req) {
        Loan updated = service.rejectLoan(id, req.reason);
        return ResponseEntity.ok(updated);
    }
}
