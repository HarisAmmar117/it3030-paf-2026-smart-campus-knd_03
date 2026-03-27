package com.zenith.webapp.auth.service.impl;

import org.springframework.stereotype.Service;

import com.zenith.webapp.auth.dto.request.UserRequest;
import com.zenith.webapp.auth.dto.response.UserResponse;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService {



    private final UserRepository userRepository;

    public UserResponse CreateUser(UserRequest userRequest){

        User user = new User();
        mapUserRequestToUser(user, userRequest);
        User savedUser = userRepository.save(user);
        return mapUserToUserResponse(savedUser);
        
    }

    private UserResponse mapUserToUserResponse(User user){

        UserResponse response = new UserResponse();
        response.setUser_id(user.getUser_id());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setCreated_at(user.getCreated_at());

        return response;

    }


    private void mapUserRequestToUser(User user, UserRequest request){

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());

    }

 
    
}
