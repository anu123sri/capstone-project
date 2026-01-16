package com.example.dto.request;

import com.example.model.CreditStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreditDecisionRequest {

    @NotNull
    private CreditStatus status; // APPROVED / REJECTED
    @NotBlank
    private String remarks;
}
