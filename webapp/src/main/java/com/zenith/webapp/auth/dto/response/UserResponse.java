package com.zenith.webapp.auth.dto.response;

import java.time.LocalDateTime;
import com.zenith.webapp.auth.enums.UserRole;


import lombok.Data;

@Data
public class UserResponse {

    private Long user_id;
    private String name;
    private String email;
    private String phone;
    private UserRole role = UserRole.USER;
    private LocalDateTime created_at;
    
}
