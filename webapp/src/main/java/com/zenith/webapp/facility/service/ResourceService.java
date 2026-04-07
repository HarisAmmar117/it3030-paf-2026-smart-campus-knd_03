package com.zenith.webapp.facility.service;

import com.zenith.webapp.facility.model.Resource;
import com.zenith.webapp.facility.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    // 1. Create or Update
    public Resource saveResource(Resource resource) {
        return repository.save(resource);
    }

    // 2. Get All
    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    // 3. Get by ID
    public Optional<Resource> getResourceById(Long id) {
        return repository.findById(id);
    }

    // 4. Delete
    public void deleteResource(Long id) {
        repository.deleteById(id);
    }

    // 5. Search / Filter Methods
    public List<Resource> getResourcesByType(Resource.Type type) {
        return repository.findByType(type);
    }
}