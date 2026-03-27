package com.zenith.webapp.auth.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {



    private String name;
    private String password;
    private String email;
    private String phone;

    
}
