package com.example.repo;

import com.example.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClientRepository extends MongoRepository<Client,String> {
    List<Client> findByRmId(String rmId);

    List<Client> findByCompanyNameContainingIgnoreCase(String companyName);

    List<Client> findByIndustryIgnoreCase(String industry);

    List<Client> findByRmIdAndCompanyNameContainingIgnoreCase(
            String rmId,
            String companyName
    );

    List<Client> findByRmIdAndIndustryIgnoreCase(
            String rmId,
            String industry
    );

}
