package com.example.service.credit;

import com.example.dto.request.CreditDecisionRequest;
import com.example.dto.request.CreditRequestDto;
import com.example.kafka.event.CreditRequestEvent;
import com.example.kafka.producer.CreditRequestProducer;
import com.example.model.CreditRequest;
import com.example.model.CreditStatus;
import com.example.repo.ClientRepository;
import com.example.repo.CreditRequestRepository;
import com.example.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditRequestServiceImpl implements CreditRequestService {

    private final CreditRequestRepository creditRequestRepository;
    private final ClientRepository clientRepository;
    private final CreditRequestProducer creditRequestProducer;

    // ===================== RM =====================

    @Override
    public CreditRequest createCreditRequest(CreditRequestDto dto) {

        clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CreditRequest request = new CreditRequest();
        request.setClientId(dto.getClientId());
        request.setSubmittedBy(authentication.getName());
        request.setRequestAmount(dto.getRequestAmount());
        request.setTenureMonths(dto.getTenureMonths());
        request.setPurpose(dto.getPurpose());
        request.setStatus(CreditStatus.PENDING);
        request.setRemarks("");
        request.setCreatedAt(LocalDateTime.now());

        CreditRequest saved = creditRequestRepository.save(request);

        // 🔥 KAFKA EVENT (RM created request)
        CreditRequestEvent event = new CreditRequestEvent(
                saved.getId(),
                saved.getClientId(),
                "CREATED",
                authentication.getName(),
                LocalDateTime.now()
        );

        creditRequestProducer.publishEvent(event);

        return saved;
    }


    @Override
    public List<CreditRequest> getMyCreditRequests() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return creditRequestRepository
                .findBySubmittedBy(authentication.getName()); // ⭐ FIX
    }


    // ===================== ANALYST =====================

    @Override
    public List<CreditRequest> getAllCreditRequests() {
        return creditRequestRepository.findAll();
    }

    @Override
    public CreditRequest updateCreditDecision(
            String requestId,
            CreditDecisionRequest decision) {

        CreditRequest request = creditRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Credit request not found"));

        if (request.getStatus() != CreditStatus.PENDING) {
            throw new RuntimeException("Decision already taken");
        }

        request.setStatus(decision.getStatus());
        request.setRemarks(decision.getRemarks());

        CreditRequest updated = creditRequestRepository.save(request);

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        // 🔥 KAFKA EVENT (Analyst decision)
        CreditRequestEvent event = new CreditRequestEvent(
                updated.getId(),
                updated.getClientId(),
                updated.getStatus().name(), // APPROVED / REJECTED
                auth.getName(),             // analyst username
                LocalDateTime.now()
        );

        creditRequestProducer.publishEvent(event);
        return updated;
    }


    public List<CreditRequest> getCreditRequestsBasedOnRole() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        boolean isAnalyst = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ANALYST"));

        if (isAnalyst) {
            return creditRequestRepository.findAll();
        }

        // RM → only own requests
        String rmUsername = auth.getName();
        return creditRequestRepository.findBySubmittedBy(rmUsername);
    }
}
