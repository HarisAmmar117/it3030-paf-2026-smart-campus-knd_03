package com.zenith.webapp.config.jwt;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // @Override
    // public UserDetails loadUserByUsername(String email) {

    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new RuntimeException("User not found"));

    //     return org.springframework.security.core.userdetails.User
    //             .withUsername(user.getEmail())
    //             .password(user.getPassword())
    //             .roles(user.getRole().name())
    //             .build();
    // }


    @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    String password = user.getPassword();
    if (password == null) {
        password = "{noop}oauth2user"; // or any placeholder
    }

    return org.springframework.security.core.userdetails.User.builder()
        .username(user.getEmail())
        .password(password)
        .roles(user.getRole().name())
        .build();
}
}