package com.zenith.webapp.auth.model;


import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import com.zenith.webapp.auth.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    private String name;

    private String password; 

    @Column(unique = true)
    private String email;

    private String phone;

    private UserRole role = UserRole.USER;

    private String provider;     
    private String providerId;   

    @CreatedDate
    private LocalDateTime created_at;
    
}
