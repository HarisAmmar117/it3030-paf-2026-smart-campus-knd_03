package com.zenith.webapp.booking.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.zenith.webapp.booking.enums.BookingStatus;
import com.zenith.webapp.facility.model.Resource;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long booking_id;

    // Many bookings → One user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private com.zenith.webapp.auth.model.User user;

    // Many bookings → One resource
    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;


    @CreationTimestamp
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String purpose;
    private int attendees;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;


    // getters & setters
}