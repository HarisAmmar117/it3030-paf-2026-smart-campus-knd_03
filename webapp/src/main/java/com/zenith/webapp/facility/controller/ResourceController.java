package com.zenith.webapp.facility.controller;

import com.zenith.webapp.facility.model.Resource;
import com.zenith.webapp.facility.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
// @CrossOrigin(origins = "http://localhost:5173") // You might need to
// uncomment this later to connect to React!
public class ResourceController {

    @Autowired
    private ResourceService service;

    // 1. POST - Create a new resource
    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource savedResource = service.saveResource(resource);
        return new ResponseEntity<>(savedResource, HttpStatus.CREATED); // Returns 201 Created
    }

    // 2. GET - Get all resources (With filtering for extra marks!)
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) Resource.Type type) {

        List<Resource> resources;
        if (type != null) {
            resources = service.getResourcesByType(type); // Filtered search
        } else {
            resources = service.getAllResources(); // Get everything
        }
        return new ResponseEntity<>(resources, HttpStatus.OK); // Returns 200 OK
    }

    // 3. GET - Get a single resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Optional<Resource> resource = service.getResourceById(id);

        return resource.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Returns 404 if missing
    }

    // 4. PUT - Update an existing resource
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resourceDetails) {
        Optional<Resource> existingResource = service.getResourceById(id);

        if (existingResource.isPresent()) {
            Resource resourceToUpdate = existingResource.get();
            // Update the fields
            resourceToUpdate.setName(resourceDetails.getName());
            resourceToUpdate.setType(resourceDetails.getType());
            resourceToUpdate.setCapacity(resourceDetails.getCapacity());
            resourceToUpdate.setLocation(resourceDetails.getLocation());
            resourceToUpdate.setAvailabilityWindow(resourceDetails.getAvailabilityWindow());
            resourceToUpdate.setStatus(resourceDetails.getStatus());

            Resource updatedResource = service.saveResource(resourceToUpdate);
            return new ResponseEntity<>(updatedResource, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE - Remove a resource
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteResource(@PathVariable Long id) {
        try {
            service.deleteResource(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Returns 204 No Content
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}