package com.example.service;

//package com.example.service.credit;
import com.example.service.credit.CreditRequestServiceImpl;
import com.example.model.Client;
import com.example.dto.request.CreditDecisionRequest;
import com.example.dto.request.CreditRequestDto;
import com.example.model.CreditRequest;
import com.example.model.CreditStatus;
import com.example.repo.ClientRepository;
import com.example.repo.CreditRequestRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreditRequestServiceImplTest {

    @Mock
    private CreditRequestRepository creditRequestRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private CreditRequestServiceImpl creditRequestService;

    // ---------- Helper methods ----------

    private void mockAuthentication(String username, String role) {
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                );

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    // ===================== RM =====================

    @Test
    void createCreditRequest_shouldSaveRequest_whenClientExists() {

        mockAuthentication("rm1", "ROLE_RELATIONSHIP_MANAGER");

        CreditRequestDto dto = new CreditRequestDto();
        dto.setClientId("client1");
        dto.setRequestAmount(500000.0);
        dto.setTenureMonths(24);
        dto.setPurpose("Working Capital");

        when(clientRepository.findById("client1"))
                .thenReturn(Optional.of(new Client()));   // ✅ FIXED

        when(creditRequestRepository.save(any(CreditRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreditRequest result =
                creditRequestService.createCreditRequest(dto);

        assertEquals("client1", result.getClientId());
        assertEquals("rm1", result.getSubmittedBy());
        assertEquals(CreditStatus.PENDING, result.getStatus());
        assertEquals("Working Capital", result.getPurpose());

        verify(creditRequestRepository).save(any(CreditRequest.class));
    }

    @Test
    void getMyCreditRequests_shouldReturnOnlyOwnRequests() {

        mockAuthentication("rm1", "ROLE_RELATIONSHIP_MANAGER");

        when(creditRequestRepository.findBySubmittedBy("rm1"))
                .thenReturn(List.of(new CreditRequest(), new CreditRequest()));

        List<CreditRequest> result =
                creditRequestService.getMyCreditRequests();

        assertEquals(2, result.size());
        verify(creditRequestRepository).findBySubmittedBy("rm1");
    }

    // ===================== ANALYST =====================

    @Test
    void getAllCreditRequests_shouldReturnAllRequests() {

        when(creditRequestRepository.findAll())
                .thenReturn(List.of(
                        new CreditRequest(),
                        new CreditRequest(),
                        new CreditRequest()
                ));

        List<CreditRequest> result =
                creditRequestService.getAllCreditRequests();

        assertEquals(3, result.size());
        verify(creditRequestRepository).findAll();
    }

    @Test
    void updateCreditDecision_shouldApproveRequest_whenPending() {

        CreditRequest request = new CreditRequest();
        request.setStatus(CreditStatus.PENDING);

        CreditDecisionRequest decision = new CreditDecisionRequest();
        decision.setStatus(CreditStatus.APPROVED);
        decision.setRemarks("Approved");

        when(creditRequestRepository.findById("1"))
                .thenReturn(Optional.of(request));

        when(creditRequestRepository.save(any(CreditRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreditRequest updated =
                creditRequestService.updateCreditDecision("1", decision);

        assertEquals(CreditStatus.APPROVED, updated.getStatus());
        assertEquals("Approved", updated.getRemarks());
    }

    @Test
    void updateCreditDecision_shouldThrowException_whenAlreadyDecided() {

        CreditRequest request = new CreditRequest();
        request.setStatus(CreditStatus.APPROVED);

        when(creditRequestRepository.findById("1"))
                .thenReturn(Optional.of(request));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> creditRequestService.updateCreditDecision(
                        "1", new CreditDecisionRequest()));

        assertEquals("Decision already taken", ex.getMessage());
    }

    // ===================== ROLE-BASED =====================

    @Test
    void getCreditRequestsBasedOnRole_shouldReturnAll_whenAnalyst() {

        mockAuthentication("analyst1", "ROLE_ANALYST");

        when(creditRequestRepository.findAll())
                .thenReturn(List.of(new CreditRequest(), new CreditRequest()));

        List<CreditRequest> result =
                creditRequestService.getCreditRequestsBasedOnRole();

        assertEquals(2, result.size());
        verify(creditRequestRepository).findAll();
    }

    @Test
    void getCreditRequestsBasedOnRole_shouldReturnOwn_whenRM() {

        mockAuthentication("rm1", "ROLE_RELATIONSHIP_MANAGER");

        when(creditRequestRepository.findBySubmittedBy("rm1"))
                .thenReturn(List.of(new CreditRequest()));

        List<CreditRequest> result =
                creditRequestService.getCreditRequestsBasedOnRole();

        assertEquals(1, result.size());
        verify(creditRequestRepository).findBySubmittedBy("rm1");
    }
}

