package com.example.controller.auth.admin.client.credit;

import com.example.dto.request.CreditDecisionRequest;
import com.example.dto.request.CreditRequestDto;
import com.example.model.CreditRequest;
import com.example.service.credit.CreditRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credit-requests")
@RequiredArgsConstructor
public class CreditRequestController {

    private final CreditRequestService creditRequestService;

    // ===================== RM =====================

    @PreAuthorize("hasRole('RELATIONSHIP_MANAGER')")
    @PostMapping
    public ResponseEntity<CreditRequest> createCreditRequest(
            @Valid @RequestBody CreditRequestDto dto) {

        return new ResponseEntity<>(
                creditRequestService.createCreditRequest(dto),
                HttpStatus.CREATED
        );
    }

    /**
     * RM → sees only own credit requests
     * ANALYST → sees all credit requests
     */
    @PreAuthorize("hasAnyRole('RELATIONSHIP_MANAGER','ANALYST')")
    @GetMapping
    public ResponseEntity<List<CreditRequest>> getCreditRequests() {
        return ResponseEntity.ok(
                creditRequestService.getCreditRequestsBasedOnRole()
        );
    }

    @PreAuthorize("hasRole('ANALYST')")
    @PutMapping("/{id}")
    public ResponseEntity<CreditRequest> updateCreditDecision(
            @PathVariable String id,
            @Valid @RequestBody CreditDecisionRequest decision) {

        return ResponseEntity.ok(
                creditRequestService.updateCreditDecision(id, decision)
        );
    }

}
