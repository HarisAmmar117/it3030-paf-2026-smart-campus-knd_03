package com.zenith.webapp.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.zenith.webapp.auth.dto.request.UserRequest;
import com.zenith.webapp.auth.dto.response.UserResponse;
import com.zenith.webapp.auth.enums.UserRole;
import com.zenith.webapp.auth.service.impl.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest){
        userRequest.setRole(UserRole.USER);

        UserResponse response = userService.createUser(userRequest);

        if(response != null){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/support-staff")
    public ResponseEntity<UserResponse> registerSupportStaff(
            @RequestBody UserRequest userRequest,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String actorRole) {

        if (!"ADMIN".equalsIgnoreCase(actorRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN can register support staff");
        }

        userRequest.setRole(UserRole.SUPPORT_STAFF);
        UserResponse response = userService.createUser(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getSingleUser(@PathVariable("id") Long userId){

        UserResponse response = userService.getUserById(userId);

        if(response != null){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(){

        List<UserResponse> users = userService.getAllUsers();

        if(users != null && !users.isEmpty()){
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.noContent().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable("id") Long userId,
            @RequestBody UserRequest userRequest){

        UserResponse updatedUser = userService.updateUser(userId, userRequest);

        if(updatedUser != null){
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId){

        boolean isDeleted = userService.deleteUser(userId);

        if(isDeleted){
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
}
