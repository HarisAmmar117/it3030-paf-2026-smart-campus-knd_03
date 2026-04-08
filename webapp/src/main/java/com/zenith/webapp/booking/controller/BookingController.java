package com.zenith.webapp.booking.controller;



import java.util.List;

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
            @RequestHeader("userId") Long userId) {
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
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody BookingStatusRequest request) {
        return ResponseEntity.ok(
                bookingService.updateBookingStatus(id, request.getStatus()));
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
            @RequestHeader("userId") Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resource) {

        return ResponseEntity.ok(
            bookingService.getBookingsByUser(userId, status, resource)
        );
    }
}