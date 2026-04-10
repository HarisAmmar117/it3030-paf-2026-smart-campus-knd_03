package com.zenith.webapp.auth.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.enums.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);
}

// Login needs findByEmail(...).
// Register needs existsByEmail(...) to block duplicates.