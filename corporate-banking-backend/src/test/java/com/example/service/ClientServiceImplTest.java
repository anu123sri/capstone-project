package com.example.service;

import com.example.dto.request.ClientRequest;
import com.example.exception.ClientNotFoundException;
import com.example.model.Client;
import com.example.repo.ClientRepository;
import com.example.security.CustomUserDetails;

import com.example.service.client.ClientServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientServiceImpl clientService;

    // ---------- Helper method to mock Security Context ----------
    private void mockAuthenticatedUser(String username) {

        CustomUserDetails userDetails = mock(CustomUserDetails.class);
        when(userDetails.getUsername()).thenReturn(username);
        when(userDetails.getAuthorities()).thenReturn(List.of());

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }


    // -------------------- createClient --------------------

    @Test
    void createClient_shouldSaveClient_whenAuthenticated() {

        mockAuthenticatedUser("rm123");

        ClientRequest request = new ClientRequest();
        request.setCompanyName("ABC Ltd");
        request.setIndustry("Manufacturing");
        request.setAddress("Mumbai");
        request.setAnnualTurnover(25.5);
        request.setDocumentsSubmitted(true);

        when(clientRepository.save(any(Client.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Client client = clientService.createClient(request);

        assertNotNull(client);
        assertEquals("ABC Ltd", client.getCompanyName());
        assertEquals("Manufacturing", client.getIndustry());
        assertEquals("rm123", client.getRmId());

        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void createClient_shouldThrowException_whenUnauthenticated() {

        SecurityContextHolder.clearContext();

        ClientRequest request = new ClientRequest();
        request.setCompanyName("ABC Ltd");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> clientService.createClient(request));

        assertEquals("Unauthenticated request", ex.getMessage());
        verify(clientRepository, never()).save(any());
    }

    // -------------------- getClientsByRm --------------------

    @Test
    void getClientsByRm_shouldReturnClientsForLoggedInRm() {

        mockAuthenticatedUser("rm123");

        when(clientRepository.findByRmId("rm123"))
                .thenReturn(List.of(new Client(), new Client()));

        List<Client> clients = clientService.getClientsByRm();

        assertEquals(2, clients.size());
        verify(clientRepository).findByRmId("rm123");
    }

    // -------------------- getClientById --------------------

    @Test
    void getClientById_shouldReturnClient_whenExists() {

        Client client = new Client();
        client.setCompanyName("ABC Ltd");

        when(clientRepository.findById("1"))
                .thenReturn(Optional.of(client));

        Client result = clientService.getClientById("1");

        assertEquals("ABC Ltd", result.getCompanyName());
    }

    @Test
    void getClientById_shouldThrowException_whenNotFound() {

        when(clientRepository.findById("1"))
                .thenReturn(Optional.empty());

        assertThrows(ClientNotFoundException.class,
                () -> clientService.getClientById("1"));
    }

    // -------------------- updateClient --------------------

    @Test
    void updateClient_shouldUpdateAndSaveClient() {

        Client existing = new Client();
        existing.setCompanyName("Old Name");

        when(clientRepository.findById("1"))
                .thenReturn(Optional.of(existing));

        when(clientRepository.save(any(Client.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ClientRequest request = new ClientRequest();
        request.setCompanyName("New Name");
        request.setIndustry("IT");
        request.setAddress("Hyderabad");
        request.setAnnualTurnover(40.0);
        request.setDocumentsSubmitted(true);

        Client updated = clientService.updateClient("1", request);

        assertEquals("New Name", updated.getCompanyName());
        assertEquals("IT", updated.getIndustry());
        verify(clientRepository).save(existing);
    }

    // -------------------- getAllClients --------------------

    @Test
    void getAllClients_shouldReturnAllClients() {

        when(clientRepository.findAll())
                .thenReturn(List.of(new Client(), new Client(), new Client()));

        List<Client> clients = clientService.getAllClients();

        assertEquals(3, clients.size());
        verify(clientRepository).findAll();
    }
}
