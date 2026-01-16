package com.example.service.credit;

import com.example.dto.request.CreditDecisionRequest;
import com.example.dto.request.CreditRequestDto;
import com.example.model.CreditRequest;

import java.util.List;

public interface CreditRequestService {

    // ===================== RM =====================

    CreditRequest createCreditRequest(CreditRequestDto dto);

    List<CreditRequest> getMyCreditRequests();


    // ===================== ANALYST =====================

    List<CreditRequest> getAllCreditRequests();

    CreditRequest updateCreditDecision(
            String requestId,
            CreditDecisionRequest decision
    );

    List<CreditRequest> getCreditRequestsBasedOnRole();
}
