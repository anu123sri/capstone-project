package com.example.service;

import com.example.dto.request.CreateUserRequest;
import com.example.model.Role;
import com.example.model.User;
import com.example.repo.UserRepository;
import com.example.service.admin.AdminUserServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
class AdminUserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserServiceImpl adminUserService;

    @Test
    void createUser_shouldSaveUser_whenUsernameNotExists() {

        CreateUserRequest request = new CreateUserRequest();
        request.setUsername("admin");
        request.setEmail("admin@test.com");
        request.setPassword("pass");
        request.setRole(Role.ANALYST);

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("pass"))
                .thenReturn("encodedPass");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User user = adminUserService.createUser(request);

        assertNotNull(user);
        assertEquals("admin", user.getUsername());
        assertEquals("encodedPass", user.getPassword());
        assertTrue(user.isActive());
    }

    @Test
    void createUser_shouldThrowException_whenUsernameExists() {

        CreateUserRequest request = new CreateUserRequest();
        request.setUsername("admin");

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> adminUserService.createUser(request));

        assertEquals("Username already exists", ex.getMessage());
    }

    @Test
    void updateUserStatus_shouldUpdateStatus_whenUserExists() {

        User user = User.builder().id("1").active(true).build();

        when(userRepository.findById("1"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User updated = adminUserService.updateUserStatus("1", false);

        assertFalse(updated.isActive());
    }

    @Test
    void updateUserStatus_shouldThrowException_whenUserNotFound() {

        when(userRepository.findById("1"))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> adminUserService.updateUserStatus("1", true));
    }
}
