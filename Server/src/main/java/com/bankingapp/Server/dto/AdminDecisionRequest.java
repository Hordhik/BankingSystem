package com.bankingapp.Server.dto;

public class AdminDecisionRequest {
    public String action; // "approve" or "reject"
    public String reason; // used when rejecting
}