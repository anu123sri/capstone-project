package com.example.service.admin;

import com.example.dto.request.CreateUserRequest;
import com.example.model.User;

public interface AdminUserService {

    User createUser(CreateUserRequest request);

    User updateUserStatus(String userId, boolean active);
}
