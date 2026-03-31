package com.zenith.webapp.auth.dto.request;

import com.zenith.webapp.auth.enums.UserRole;

import lombok.Data;

@Data
public class UserRequest {



    private String name;
    private String password;
    private String email;
    private UserRole role = UserRole.USER;
    private String phone;

    
}
