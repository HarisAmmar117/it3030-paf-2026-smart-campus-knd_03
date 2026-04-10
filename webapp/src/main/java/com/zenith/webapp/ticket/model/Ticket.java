package com.zenith.webapp.ticket.model;

import com.zenith.webapp.ticket.enums.TicketCategory;
import com.zenith.webapp.ticket.enums.TicketPriority;
import com.zenith.webapp.ticket.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;



@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 120)
    private String resourceLocation;

    @Column(nullable = false, length = 120)
    private String preferredContactDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketStatus status;

    @Column(length = 1000)
    private String resolutionNotes;

    @Column(length = 500)
    private String rejectionReason;

    private LocalDateTime firstResponseAt;

    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    private Long requesterId;

    private Long assigneeId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

//   Runs automatically right before Hibernate inserts a new row into the database.  
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = TicketStatus.OPEN;
        }
    }
// Runs automatically right before Hibernate updates an existing row.
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
