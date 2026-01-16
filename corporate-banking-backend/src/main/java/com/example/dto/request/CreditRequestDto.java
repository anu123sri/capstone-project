package com.example.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreditRequestDto {

    @NotBlank
    private String clientId;

    @NotNull
    @Positive
    private Double requestAmount;

    @NotNull
    @Positive
    private Integer tenureMonths;

    @NotBlank
    private String purpose;
}
