package com.example.service.user;

import com.example.dto.request.CreateUserRequest;
import com.example.model.Role;
import com.example.model.User;
import com.example.repo.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    // -------------------- createUser --------------------

    @Test
    void createUser_shouldSaveUserWithEncodedPassword() {

        CreateUserRequest request = new CreateUserRequest();
        request.setUsername("john");
        request.setEmail("john@test.com");
        request.setPassword("password");
        request.setRole(Role.RELATIONSHIP_MANAGER);

        when(passwordEncoder.encode("password"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(request);

        assertNotNull(result);
        assertEquals("john", result.getUsername());
        assertEquals("john@test.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());
        assertEquals(Role.RELATIONSHIP_MANAGER, result.getRole());
        assertTrue(result.isActive());

        verify(userRepository, times(1)).save(any(User.class));
    }

    // -------------------- updateUserStatus --------------------

    @Test
    void updateUserStatus_shouldUpdateStatus_whenUserExists() {

        User user = User.builder()
                .id("1")
                .active(true)
                .build();

        when(userRepository.findById("1"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User updatedUser = userService.updateUserStatus("1", false);

        assertFalse(updatedUser.isActive());
        verify(userRepository).findById("1");
        verify(userRepository).save(user);
    }

    @Test
    void updateUserStatus_shouldThrowException_whenUserNotFound() {

        when(userRepository.findById("1"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.updateUserStatus("1", false)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findById("1");
        verify(userRepository, never()).save(any());
    }

    // -------------------- getAllUsers --------------------

    @Test
    void getAllUsers_shouldReturnAllUsers() {

        List<User> mockUsers = List.of(
                User.builder().username("u1").build(),
                User.builder().username("u2").build()
        );

        when(userRepository.findAll())
                .thenReturn(mockUsers);

        List<User> users = userService.getAllUsers();

        assertEquals(2, users.size());
        verify(userRepository).findAll();
    }
}
