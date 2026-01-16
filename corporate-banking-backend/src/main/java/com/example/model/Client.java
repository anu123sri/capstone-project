package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    private String id;

    private String companyName;

    private String industry;

    private String address;

    // ✅ FIX: make it an object, not String
    private PrimaryContact primaryContact;

    private Double annualTurnover;

    private boolean documentsSubmitted;

    // RM who created this client
    private String rmId;
}
