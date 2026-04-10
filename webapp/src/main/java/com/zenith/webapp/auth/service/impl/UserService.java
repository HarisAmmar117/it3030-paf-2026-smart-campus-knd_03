package com.zenith.webapp.auth.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.zenith.webapp.auth.dto.request.UserRequest;
import com.zenith.webapp.auth.dto.response.UserResponse;
import com.zenith.webapp.auth.enums.UserRole;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;
import com.zenith.webapp.config.jwt.JwtTokenProvider;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import com.zenith.webapp.auth.dto.request.LoginRequest;
import com.zenith.webapp.auth.dto.response.AuthResponse;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    public UserResponse createUser(UserRequest userRequest){

        User user = new User();

     
        mapUserRequestToUser(user, userRequest);

   
        if(user.getRole() == null) {
            user.setRole(UserRole.USER);       
        }

        if(user.getCreated_at() == null){
            user.setCreated_at(LocalDateTime.now()); 
        }

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
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
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

    }

      public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

    // 🔥 FIX: block OAuth users from normal login
    if (user.getPassword() == null) {
        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "This account uses Google login. Please sign in with Google."
        );
    }

    // 🔥 SAFE password check
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    // ✅ GENERATE JWT
    String token = jwtTokenProvider.generateToken(
            user.getEmail(),
            user.getRole().name(),
            user.getUser_id()
    );

    AuthResponse response = new AuthResponse();
    response.setToken(token);
    response.setId(user.getUser_id());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());

    return response;
}
}