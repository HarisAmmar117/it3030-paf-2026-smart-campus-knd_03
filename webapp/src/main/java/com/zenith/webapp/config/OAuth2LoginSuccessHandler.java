package com.zenith.webapp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.zenith.webapp.config.jwt.JwtTokenProvider;
import com.zenith.webapp.auth.enums.UserRole;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        // =========================
        // SAFE ATTRIBUTE EXTRACTION
        // =========================
        String email = oauthUser.getAttribute("email");
        String rawName = oauthUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            throw new RuntimeException("OAuth2 login failed: email not found");
        }

        final String name = (rawName == null || rawName.isBlank())
                ? "Google User"
                : rawName;

        // =========================
        // FETCH OR CREATE USER
        // =========================
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setRole(UserRole.USER);
                    newUser.setProvider("GOOGLE");

                    Object sub = oauthUser.getAttribute("sub");
                    if (sub != null) {
                        newUser.setProviderId(sub.toString());
                    }

                    return userRepository.save(newUser);
                });

        Long userId = user.getUser_id();
        String role = user.getRole().name();

        // =========================
        // GENERATE JWT TOKEN
        // =========================
        String token = jwtTokenProvider.generateToken(email, role, userId);

        // =========================
        // REDIRECT TO FRONTEND
        // =========================
        String redirectUrl = frontendUrl + "/oauth-success"
                + "?token=" + token
                + "&id=" + userId
                + "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8)
                + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                + "&role=" + role;

        response.sendRedirect(redirectUrl);
    }
}