package com.zenith.webapp.facility.service;

import com.zenith.webapp.facility.enums.Type;
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

    public Resource saveResource(Resource resource) {
        return repository.save(resource);
    }

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return repository.findById(id);
    }

    public void deleteResource(Long id) {
        repository.deleteById(id);
    }

    public List<Resource> getResourcesByType(Type type) {
        return repository.findByType(type);
    }
}