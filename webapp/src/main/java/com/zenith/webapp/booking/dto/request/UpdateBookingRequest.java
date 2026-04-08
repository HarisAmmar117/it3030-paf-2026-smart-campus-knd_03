package com.zenith.webapp.booking.dto.request;


import java.time.LocalDateTime;

import com.zenith.webapp.booking.enums.BookingStatus;

import lombok.Data;

@Data
public class UpdateBookingRequest {
    private Long resourceId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private String purpose;
    private int attendees;
}