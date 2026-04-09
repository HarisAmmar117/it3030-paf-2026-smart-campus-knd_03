package com.zenith.webapp.ticket.repository;

import com.zenith.webapp.ticket.enums.TicketPriority;
import com.zenith.webapp.ticket.enums.TicketStatus;
import com.zenith.webapp.ticket.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(TicketPriority priority);
    List<Ticket> findByRequesterId(Long requesterId);
}


// JpaRepository is a Spring Data JPA interface that provides ready‑made 
// database operations.
