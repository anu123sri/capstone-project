package com.example.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditRequestEvent {

    private String creditRequestId;
    private String clientId;
    private String action;        // CREATED / APPROVED / REJECTED
    private String performedBy;   // rm / analyst username
    private LocalDateTime timestamp;
}
