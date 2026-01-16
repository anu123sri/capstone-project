package com.example.controller.auth.admin;

import com.example.dto.request.CreateUserRequest;
import com.example.model.User;
import com.example.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    // ✅ CREATE USER
    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        User user = userService.createUser(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // ✅ LIST ALL USERS (FIXED ENDPOINT)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ ACTIVATE / DEACTIVATE USER
    @PutMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable String id,
            @RequestParam boolean active
    ) {
        User user = userService.updateUserStatus(id, active);
        return ResponseEntity.ok(user);
    }
}
