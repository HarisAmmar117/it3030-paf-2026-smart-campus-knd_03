package com.zenith.webapp.booking.dto.response;


import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingResponse {

    private Long bookingId;

    private Long userId;
    private String userName;

    private Long resourceId;
    private String resourceName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String purpose;
    private int attendees;

    private String status;
}