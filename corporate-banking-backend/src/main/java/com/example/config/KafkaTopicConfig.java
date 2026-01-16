package com.example.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic creditRequestTopic() {
        return TopicBuilder
                .name("credit-request-events")
                .partitions(1)
                .replicas(1)
                .build();
    }
}

