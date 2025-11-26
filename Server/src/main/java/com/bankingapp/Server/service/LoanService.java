package com.bankingapp.Server.service;

import com.bankingapp.Server.model.Loan;
import com.bankingapp.Server.model.LoanStatus;
import com.bankingapp.Server.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository repo;

    public LoanService(LoanRepository repo) {
        this.repo = repo;
    }

    public Loan applyLoan(Loan loan) {
        loan.setStatus(LoanStatus.PENDING);
        loan.setInterestRate(BigDecimal.valueOf(10.0)); // default 10%
        return repo.save(loan);
    }

    public List<Loan> getLoansForUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }


    @Transactional
    public Loan approveLoan(Long id) {
        Loan loan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        BigDecimal P = loan.getPrincipalAmount();
        int N = loan.getTenureMonths();
        double annualRate = loan.getInterestRate().doubleValue() / 100.0;
        double R = annualRate / 12;

        double emi = (P.doubleValue() * R * Math.pow(1 + R, N))
                / (Math.pow(1 + R, N) - 1);

        BigDecimal monthlyEmi = BigDecimal.valueOf(emi).setScale(2, java.math.RoundingMode.HALF_UP);

        BigDecimal totalPayable = monthlyEmi.multiply(BigDecimal.valueOf(N)).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalInterest = totalPayable.subtract(P).setScale(2, java.math.RoundingMode.HALF_UP);

        loan.setMonthlyEmi(monthlyEmi);
        loan.setTotalInterest(totalInterest);
        loan.setTotalPayable(totalPayable);

        loan.setDetails(
                "Principal: ₹" + P +
                        " | Tenure: " + N + " months" +
                        " | EMI: ₹" + monthlyEmi.setScale(0, java.math.RoundingMode.HALF_UP)
        );

        loan.setStatus(LoanStatus.ACTIVE);
        loan.setAdminReason(null);

        loan.setNextPayment(
                "EMI due on " + LocalDate.now().plusMonths(1).getDayOfMonth()
        );

        return repo.save(loan);
    }

    @Transactional
    public Loan rejectLoan(Long id, String reason) {
        Loan loan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.REJECTED);
        loan.setAdminReason(reason);
        loan.setDetails("Rejected: " + reason);
        loan.setNextPayment(null);

        return repo.save(loan);
    }

    public List<Loan> getAllLoans() {
        return repo.findAll();
    }

    public Loan saveLoan(Loan loan) {
        return repo.save(loan);
    }
}
