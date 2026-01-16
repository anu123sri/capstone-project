package com.example.service.user;

import com.example.dto.request.CreateUserRequest;
import com.example.model.User;

import java.util.List;

public interface UserService {
    User createUser(CreateUserRequest request);

    User updateUserStatus(String userId,boolean active);

    List<User> getAllUsers();
}
