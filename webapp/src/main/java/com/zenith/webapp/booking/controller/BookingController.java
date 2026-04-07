package com.zenith.webapp.booking.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zenith.webapp.booking.dto.request.BookingRequest;
import com.zenith.webapp.booking.dto.response.BookingResponse;
import com.zenith.webapp.booking.service.impl.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            @RequestHeader("userId") Long userId) {  // user from header
        BookingResponse response = bookingService.createBooking(request, userId);
        return ResponseEntity.ok(response);
    }
}