package com.zenith.webapp.facility.dto.response;

import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.enums.Status;

public class ResourceResponseDTO {

    // ID field is included to send back to the React frontend
    private Long id;
    private String name;
    private Type type;
    private int capacity;
    private int quantity;
    private String location;
    private String availabilityWindow;
    private Status status;

    // --- GETTERS AND SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvailabilityWindow() {
        return availabilityWindow;
    }

    public void setAvailabilityWindow(String availabilityWindow) {
        this.availabilityWindow = availabilityWindow;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}