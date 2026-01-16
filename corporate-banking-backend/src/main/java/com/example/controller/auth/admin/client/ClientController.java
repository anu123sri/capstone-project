package com.example.controller.auth.admin.client;

import com.example.dto.request.ClientRequest;
import com.example.model.Client;
import com.example.service.client.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rm/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PreAuthorize("hasRole('RELATIONSHIP_MANAGER')")
    @PostMapping
    public ResponseEntity<Client> createClient(
            @Valid @RequestBody ClientRequest request
    ) {
        Client client = clientService.createClient(request);
        return new ResponseEntity<>(client, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Client>> searchClients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String industry
    ) {
        return ResponseEntity.ok(clientService.searchClients(name, industry));
    }


    @PreAuthorize("hasAnyRole('ADMIN','RELATIONSHIP_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable String id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PreAuthorize("hasRole('RELATIONSHIP_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable String id,
            @Valid @RequestBody ClientRequest request
    ) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<Client>> getAllClientsForAdmin() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

}
