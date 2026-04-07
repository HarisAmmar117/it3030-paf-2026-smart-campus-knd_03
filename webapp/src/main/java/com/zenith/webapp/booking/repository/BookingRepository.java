package com.zenith.webapp.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zenith.webapp.booking.model.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // For conflict checking
    List<Booking> findByResourceIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}   