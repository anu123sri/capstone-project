package com.example.service.client;

import com.example.dto.request.ClientRequest;
import com.example.model.Client;

import java.util.List;

public interface ClientService {
    Client createClient(ClientRequest request);

    List<Client> getClientsByRm( );

    Client getClientById(String id);

    Client updateClient(String id, ClientRequest request);
    List<Client> getAllClients();
    List<Client> searchClients(String name, String industry);


}
