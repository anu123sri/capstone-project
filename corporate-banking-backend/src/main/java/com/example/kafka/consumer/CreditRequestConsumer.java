package com.example.kafka.consumer;

import com.example.kafka.event.CreditRequestEvent;
import jakarta.annotation.PostConstruct;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CreditRequestConsumer {

    @PostConstruct
    public void init() {
        System.out.println("KAFKA CONSUMER INITIALIZED");
    }

    @KafkaListener(
            topics = "credit-request-events",
            groupId = "credit-group"
    )
    public void consume(CreditRequestEvent event) {
        System.out.println("KAFKA EVENT RECEIVED");
        System.out.println(event);
    }
}
