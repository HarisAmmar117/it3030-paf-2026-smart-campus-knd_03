package com.zenith.webapp.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.zenith.webapp.auth.dto.request.UserRequest;
import com.zenith.webapp.auth.dto.response.UserResponse;
import com.zenith.webapp.auth.service.impl.UserService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest){

        UserResponse response = userService.CreateUser(userRequest);

        if(response != null){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
}
