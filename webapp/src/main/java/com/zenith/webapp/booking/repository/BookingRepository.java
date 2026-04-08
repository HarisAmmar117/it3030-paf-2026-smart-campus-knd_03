package com.zenith.webapp.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT b FROM Booking b WHERE b.user.user_id = :userId")
    List<Booking> findBookingsByUserId(@Param("userId") Long userId);
}   