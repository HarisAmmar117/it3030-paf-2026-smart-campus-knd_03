package com.zenith.webapp.auth.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.zenith.webapp.auth.dto.request.UserRequest;
import com.zenith.webapp.auth.dto.response.UserResponse;
import com.zenith.webapp.auth.enums.UserRole;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse createUser(UserRequest userRequest){

        User user = new User();

     
        mapUserRequestToUser(user, userRequest);

   
        if(user.getRole() == null) {
            user.setRole(UserRole.USER);       
        }

        if(user.getCreated_at() == null){
            user.setCreated_at(LocalDateTime.now()); 
        }

        User savedUser = userRepository.save(user);
        return mapUserToUserResponse(savedUser);
    }

    public List<UserResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(this::mapUserToUserResponse)
                .toList();
    }

    public UserResponse getUserById(Long id){
        return userRepository.findById(id)
                .map(this::mapUserToUserResponse)
                .orElse(null);
    }

    public UserResponse updateUser(Long id, UserRequest request){

        return userRepository.findById(id).map(user -> {

            // update fields
            mapUserRequestToUser(user, request);

            User updatedUser = userRepository.save(user);
            return mapUserToUserResponse(updatedUser);

        }).orElse(null);
    }


    public boolean deleteUser(Long id){

        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
            return true;
        }
        return false;
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