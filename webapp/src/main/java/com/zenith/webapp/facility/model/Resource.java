package com.zenith.webapp.facility.model;

import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.enums.Status;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "resources")
@Data
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

    @Column(columnDefinition = "int default 0")
    private int quantity;

    @Column(nullable = false)
    private String location;

    @Column(name = "availability_window")
    private String availabilityWindow;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
}