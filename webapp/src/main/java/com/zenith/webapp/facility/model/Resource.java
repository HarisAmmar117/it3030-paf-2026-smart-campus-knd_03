package com.zenith.webapp.facility.model;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(columnDefinition = "int default 0")
    private int capacity;

    @Column(nullable = false)
    private String location;

    @Column(name = "availability_window")
    private String availabilityWindow;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    // Enums
    public enum Type {
        ROOM, LAB, EQUIPMENT
    }

    public enum Status {
        ACTIVE, OUT_OF_SERVICE
    }

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