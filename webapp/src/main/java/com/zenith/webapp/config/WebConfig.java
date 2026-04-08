package com.zenith.webapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.ticket.upload-dir:uploads/tickets}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded ticket images at /uploads/tickets/**
        registry.addResourceHandler("/uploads/tickets/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}

// Spring Boot will return 404 Not Found because Spring doesn't
// serve arbitrary filesystem files by default — it only serves files
// from src/main/resources/static/.