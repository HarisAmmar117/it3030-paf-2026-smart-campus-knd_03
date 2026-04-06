package com.zenith.webapp.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zenith.webapp.auth.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
}
