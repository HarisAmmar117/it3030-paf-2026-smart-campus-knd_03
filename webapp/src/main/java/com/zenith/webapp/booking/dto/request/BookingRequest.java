package com.zenith.webapp.booking.dto.request;


import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingRequest {

    private Long userId;
    private Long resourceId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String purpose;
    private int attendees;
}