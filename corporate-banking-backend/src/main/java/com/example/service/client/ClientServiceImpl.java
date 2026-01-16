package com.example.service.client;

import com.example.dto.request.ClientRequest;
import com.example.exception.ClientNotFoundException;
import com.example.model.Client;
import com.example.model.PrimaryContact;
import com.example.repo.ClientRepository;
import com.example.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public Client createClient(ClientRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        String rmId = userDetails.getUsername();

        // ✅ Build PrimaryContact explicitly
        PrimaryContact primaryContact = PrimaryContact.builder()
                .name(request.getContactName())
                .email(request.getContactEmail())
                .phone(request.getContactPhone())
                .build();

        Client client = Client.builder()
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .address(request.getAddress())
                .annualTurnover(request.getAnnualTurnover())
                .documentsSubmitted(request.isDocumentsSubmitted()) // ✅ THIS IS KEY
                .primaryContact(primaryContact)
                .rmId(rmId)
                .build();

        return clientRepository.save(client);
    }


    @Override
    public List<Client> getClientsByRm() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        return clientRepository.findByRmId(userDetails.getUsername());
    }

    @Override
    public Client getClientById(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new ClientNotFoundException("Client not found"));
    }

    @Override
    public Client updateClient(String id, ClientRequest request) {

        Client client = getClientById(id);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        String rmId = userDetails.getUsername();

        // 🔐 Ownership check
        if (!client.getRmId().equals(rmId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to update this client"
            );
        }

        // 🔴 Business rule
        if (client.isDocumentsSubmitted()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Submitted clients cannot be edited"
            );
        }

        // ✅ Update allowed fields
        client.setCompanyName(request.getCompanyName());
        client.setIndustry(request.getIndustry());
        client.setAddress(request.getAddress());
        client.setAnnualTurnover(request.getAnnualTurnover());

        if (client.getPrimaryContact() == null) {
            client.setPrimaryContact(new PrimaryContact());
        }

        client.getPrimaryContact().setName(request.getContactName());
        client.getPrimaryContact().setEmail(request.getContactEmail());
        client.getPrimaryContact().setPhone(request.getContactPhone());

        return clientRepository.save(client);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public List<Client> searchClients(String name, String industry) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        String rmId = userDetails.getUsername();

        if (name != null && !name.isBlank()) {
            return clientRepository
                    .findByRmIdAndCompanyNameContainingIgnoreCase(rmId, name);
        }

        if (industry != null && !industry.isBlank()) {
            return clientRepository
                    .findByRmIdAndIndustryIgnoreCase(rmId, industry);
        }

        return clientRepository.findByRmId(rmId);
    }
}
