package com.zenith.webapp.booking.controller;



import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zenith.webapp.booking.dto.request.BookingRequest;
import com.zenith.webapp.booking.dto.request.BookingStatusRequest;
import com.zenith.webapp.booking.dto.request.UpdateBookingRequest;
import com.zenith.webapp.booking.dto.response.BookingResponse;
import com.zenith.webapp.booking.service.impl.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE by user
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            HttpServletRequest httpRequest) {
        // Get userId from request attribute (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            // Fallback to header if attribute not set
            String userIdHeader = httpRequest.getHeader("userId");
            if (userIdHeader != null) {
                userId = Long.parseLong(userIdHeader);
            }
        }
        if (userId == null) {
            throw new RuntimeException("User ID not found in authentication");
        }
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // UPDATE BOOKING DETAILS
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Long id,
            @RequestBody UpdateBookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    // UPDATE STATUS
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody BookingStatusRequest request) {
        
        BookingResponse response = bookingService.updateBookingStatus(
            bookingId, 
            request.getStatus(),
            request.getRejectionReason()
        );
        return ResponseEntity.ok(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }


    //USER specific bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resource) {
        
        // Get userId from request attribute (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            // Fallback to header if attribute not set
            String userIdHeader = httpRequest.getHeader("userId");
            if (userIdHeader != null) {
                userId = Long.parseLong(userIdHeader);
            }
        }
        if (userId == null) {
            throw new RuntimeException("User ID not found in authentication");
        }

        return ResponseEntity.ok(
            bookingService.getBookingsByUser(userId, status, resource)
        );
    }
}