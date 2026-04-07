package com.zenith.webapp.booking.service.impl;

import com.zenith.webapp.booking.dto.request.BookingRequest;

import com.zenith.webapp.booking.dto.response.BookingResponse;
import com.zenith.webapp.booking.enums.BookingStatus;
import com.zenith.webapp.booking.model.Booking;
import com.zenith.webapp.booking.repository.BookingRepository;
import com.zenith.webapp.facility.model.Resource;
import com.zenith.webapp.facility.repository.ResourceRepository;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    // ------------------ CREATE BOOKING ------------------
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(request.getStartTime()); // from request
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    // ------------------ GET ALL BOOKINGS ------------------
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ------------------ GET SINGLE BOOKING ------------------
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return mapToResponse(booking);
    }

    // ------------------ UPDATE BOOKING ------------------
    @Transactional
    public BookingResponse updateBooking(Long bookingId, BookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());

        Booking updated = bookingRepository.save(booking);
        return mapToResponse(updated);
    }

    // ------------------ DELETE BOOKING ------------------
    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        bookingRepository.delete(booking);
    }

    // ------------------ UPDATE STATUS ------------------
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    // ------------------ MAPPER ------------------
    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBooking_id());
        response.setUserId(booking.getUser().getUser_id());
        response.setUserName(booking.getUser().getName());
        response.setResourceId(booking.getResource().getId());
        response.setResourceName(booking.getResource().getName());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setPurpose(booking.getPurpose());
        response.setAttendees(booking.getAttendees());
        response.setStatus(booking.getStatus().name());
        return response;
    }
}