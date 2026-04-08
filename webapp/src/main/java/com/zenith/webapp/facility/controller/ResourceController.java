package com.zenith.webapp.facility.controller;

import com.zenith.webapp.facility.dto.request.ResourceRequestDTO;
import com.zenith.webapp.facility.dto.response.ResourceResponseDTO;
import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.model.Resource;
import com.zenith.webapp.facility.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*") 
public class ResourceController {

    @Autowired
    private ResourceService service;

    // Helper: Database Entity -> Response DTO
    private ResourceResponseDTO convertToResponseDTO(Resource resource) {
        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setQuantity(resource.getQuantity());
        dto.setLocation(resource.getLocation());
        dto.setAvailabilityWindow(resource.getAvailabilityWindow());
        dto.setStatus(resource.getStatus());
        return dto;
    }

    // Helper: Request DTO -> Database Entity
    private Resource convertToEntity(ResourceRequestDTO dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setQuantity(dto.getQuantity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindow(dto.getAvailabilityWindow());
        resource.setStatus(dto.getStatus());
        return resource;
    }

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@RequestBody ResourceRequestDTO requestDTO) {
        Resource resource = convertToEntity(requestDTO);
        Resource savedResource = service.saveResource(resource);
        return new ResponseEntity<>(convertToResponseDTO(savedResource), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources(
            @RequestParam(required = false) Type type) {
        
        List<Resource> resources;
        if (type != null) {
            resources = service.getResourcesByType(type);
        } else {
            resources = service.getAllResources();
        }
        
        List<ResourceResponseDTO> responseList = resources.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
                
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        Optional<Resource> resource = service.getResourceById(id);
        
        return resource.map(value -> new ResponseEntity<>(convertToResponseDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(@PathVariable Long id, @RequestBody ResourceRequestDTO requestDTO) {
        Optional<Resource> existingResource = service.getResourceById(id);
        
        if (existingResource.isPresent()) {
            Resource resourceToUpdate = existingResource.get();
            resourceToUpdate.setName(requestDTO.getName());
            resourceToUpdate.setType(requestDTO.getType());
            resourceToUpdate.setCapacity(requestDTO.getCapacity());
            resourceToUpdate.setQuantity(requestDTO.getQuantity());
            resourceToUpdate.setLocation(requestDTO.getLocation());
            resourceToUpdate.setAvailabilityWindow(requestDTO.getAvailabilityWindow());
            resourceToUpdate.setStatus(requestDTO.getStatus());
            
            Resource updatedResource = service.saveResource(resourceToUpdate);
            return new ResponseEntity<>(convertToResponseDTO(updatedResource), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteResource(@PathVariable Long id) {
        try {
            service.deleteResource(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}