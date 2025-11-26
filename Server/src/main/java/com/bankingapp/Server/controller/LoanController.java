package com.bankingapp.Server.controller;

import com.bankingapp.Server.dto.LoanApplyRequest;
import com.bankingapp.Server.dto.LoanResponse;
import com.bankingapp.Server.model.Loan;
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

    // ---------------- APPLY LOAN ----------------
    @PostMapping("/apply")
    public ResponseEntity<LoanResponse> apply(@RequestBody LoanApplyRequest req) {

        Loan loan = new Loan();
        loan.setUserId(req.userId);
        loan.setAccountNumber(req.accountNumber);
        loan.setLoanType(req.loanType);
        loan.setPrincipalAmount(req.principalAmount);
        loan.setTenureMonths(req.tenureMonths);

        Loan saved = service.applyLoan(loan);

        return ResponseEntity.ok(toResponse(saved));
    }

    // ---------------- USER LOANS ----------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> getUserLoans(@PathVariable Long userId) {
        List<Loan> loans = service.getLoansForUser(userId);
        return ResponseEntity.ok(loans.stream().map(this::toResponse).toList());
    }

    // ---------------- ADMIN ALL LOANS ----------------
    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAll() {
        List<Loan> loans = service.getAllLoans();
        return ResponseEntity.ok(loans.stream().map(this::toResponse).toList());
    }

    // ---------------- APPROVE ----------------
    @PostMapping("/{id}/approve")
    public ResponseEntity<LoanResponse> approve(@PathVariable Long id) {
        Loan loan = service.approveLoan(id);
        return ResponseEntity.ok(toResponse(loan));
    }

    // ---------------- REJECT ----------------
    @PostMapping("/{id}/reject")
    public ResponseEntity<LoanResponse> reject(@PathVariable Long id, @RequestBody String reason) {
        Loan loan = service.rejectLoan(id, reason);
        return ResponseEntity.ok(toResponse(loan));
    }

    // -------- TEST ENDPOINT - Create PENDING Loan --------
    @PostMapping("/test/create-pending")
    public ResponseEntity<String> createPendingLoan() {
        try {
            Loan testLoan = new Loan();
            testLoan.setUserId(1L); // Assuming user with ID 1 exists
            testLoan.setAccountNumber("9876543210");
            testLoan.setLoanType("Personal Loan");
            testLoan.setPrincipalAmount(new java.math.BigDecimal("100000.00"));
            testLoan.setTenureMonths(12);
            testLoan.setInterestRate(new java.math.BigDecimal("10.00"));
            testLoan.setStatus(com.bankingapp.Server.model.LoanStatus.PENDING);
            testLoan.setDetails("Test PENDING loan for demonstration");
            
            service.saveLoan(testLoan);
            return ResponseEntity.ok("✅ Test PENDING loan created successfully! Check admin loans page.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }


    // ---------------- MAPPER ----------------
    private LoanResponse toResponse(Loan loan) {
        LoanResponse response = new LoanResponse();
        response.setId(loan.getId());
        response.setUserId(loan.getUserId());
        response.setAccountNumber(loan.getAccountNumber());
        response.setLoanType(loan.getLoanType());
        response.setStatus(loan.getStatus().name());
        response.setPrincipalAmount("₹" + loan.getPrincipalAmount());
        response.setTenure(loan.getTenureMonths() + " months");
        response.setMonthlyEmi(loan.getMonthlyEmi() != null ? ("₹" + loan.getMonthlyEmi().setScale(0, java.math.RoundingMode.HALF_UP)) : "--");
        response.setTotalInterest(loan.getTotalInterest() != null ? ("₹" + loan.getTotalInterest().setScale(0, java.math.RoundingMode.HALF_UP)) : "--");
        response.setTotalPayable(loan.getTotalPayable() != null ? ("₹" + loan.getTotalPayable().setScale(0, java.math.RoundingMode.HALF_UP)) : "--");
        response.setDetails(loan.getDetails() != null ? loan.getDetails() : "Awaiting approval");
        response.setAdminReason(loan.getAdminReason());
        response.setCreatedAt(loan.getCreatedAt().toString());
        return response;
    }
}
