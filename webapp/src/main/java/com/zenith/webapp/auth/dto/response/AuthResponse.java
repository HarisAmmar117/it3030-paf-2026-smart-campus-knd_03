package com.zenith.webapp.auth.dto.response;

import com.zenith.webapp.auth.enums.UserRole;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    
}
