package com.zenith.webapp.facility.repository;

import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    List<Resource> findByType(Type type);
    List<Resource> findByCapacityGreaterThanEqual(int capacity);
    List<Resource> findByLocationContainingIgnoreCase(String location);
}