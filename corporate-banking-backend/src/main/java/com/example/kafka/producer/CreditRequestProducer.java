package com.example.kafka.producer;

import com.example.kafka.event.CreditRequestEvent;
import lombok.RequiredArgsConstructor;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreditRequestProducer {

    private static final String TOPIC = "credit-request-events";

    private final KafkaTemplate<String, CreditRequestEvent> kafkaTemplate;

    public void publishEvent(CreditRequestEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
