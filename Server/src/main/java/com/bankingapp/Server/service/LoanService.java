package com.bankingapp.Server.service;

import com.bankingapp.Server.model.Loan;
import com.bankingapp.Server.model.LoanStatus;
import com.bankingapp.Server.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoanService {
    private final LoanRepository repo;

    public LoanService(LoanRepository repo) {
        this.repo = repo;
    }

    public Loan applyLoan(Loan loan) {
        // set initial status to IN_VERIFICATION (you can choose PENDING instead)
        loan.setStatus(LoanStatus.IN_VERIFICATION);
        return repo.save(loan);
    }

    public List<Loan> getLoansForUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Loan> getAllLoans() {
        return repo.findAll();
    }

    @Transactional
    public Loan approveLoan(Long id) {
        Loan loan = repo.findById(id).orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(LoanStatus.ACTIVE);
        // optionally compute nextPayment here
        loan.setNextPayment("EMI due on 15th " + java.time.LocalDate.now().getMonth().name());
        return repo.save(loan);
    }

    @Transactional
    public Loan rejectLoan(Long id, String reason) {
        Loan loan = repo.findById(id).orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(LoanStatus.REJECTED);
        loan.setAdminReason(reason);
        return repo.save(loan);
    }
}
