package com.zenith.webapp.booking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.booking.enums.BookingStatus;

@Entity
@Table(name = "booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // @ManyToOne
    // @JoinColumn(name = "resource_id", nullable = false)
    // private Resource resource;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    @Column(columnDefinition = "TEXT")
    private String purpose;
    
    private Integer expectedAttendees;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING; 
    
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    
    @Column(columnDefinition = "TEXT")
    private String approvalNotes;
    
    
}