package com.example.config;

import com.example.model.Role;
import com.example.model.User;
import com.example.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

//@Configuration
//@RequiredArgsConstructor
//public class DataInitializer {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Bean
//    CommandLineRunner initUsers() {
//        return args -> {
//
//            createUserIfNotExists("admin", "admin@bank.com",
//                    "admin123", Role.ADMIN);
//
//            createUserIfNotExists("rm1", "rm@bank.com",
//                    "rm123", Role.RELATIONSHIP_MANAGER);
//
//            createUserIfNotExists("analyst1", "analyst@bank.com",
//                    "analyst123", Role.ANALYST);
//        };
//    }
//
//    private void createUserIfNotExists(String username,
//                                       String email,
//                                       String password,
//                                       Role role) {
//
//        if (userRepository.findByUsername(username).isEmpty()) {
//
//            User user = User.builder()
//                    .username(username)
//                    .email(email)
//                    .password(passwordEncoder.encode(password))
//                    .role(role)
//                    .active(true)
//                    .build();
//
//            userRepository.save(user);
//
//            System.out.println("✅ USER CREATED → " + username + " (" + role + ")");
//        }
//    }
//}
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initUsers() {
        return args -> {

            createUserIfNotExists("admin", "admin@bank.com",
                    "admin123", Role.ADMIN);

            createUserIfNotExists("rm", "rm@bank.com",
                    "rm123", Role.RELATIONSHIP_MANAGER);

            createUserIfNotExists("analyst1", "analyst@bank.com",
                    "analyst123", Role.ANALYST);
        };
    }

    private void createUserIfNotExists(String username,
                                       String email,
                                       String password,
                                       Role role) {

        if (!userRepository.existsByUsername(username)) {

            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .active(true)
                    .build();

            userRepository.save(user);

            System.out.println("✅ USER CREATED → " + username + " (" + role + ")");
        }
    }
}


