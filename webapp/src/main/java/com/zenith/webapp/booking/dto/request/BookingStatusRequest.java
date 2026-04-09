package com.zenith.webapp.booking.dto.request;

import com.zenith.webapp.booking.enums.BookingStatus;

import lombok.Data;

@Data
public class BookingStatusRequest {
    private BookingStatus status;
    private String rejectionReason;
}