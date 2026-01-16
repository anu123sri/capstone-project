package com.example.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {

    @NotBlank
    private String companyName;

    @NotBlank
    private String industry;

    private String address;

    @NotBlank
    @Email
    private String contactEmail;

    @NotBlank
    private String contactName;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String contactPhone;

    @Positive
    private Double annualTurnover;

    private boolean documentsSubmitted;
    private String primaryContact;
}
