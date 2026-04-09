package com.zenith.webapp.booking.service.impl;

import com.zenith.webapp.booking.dto.request.BookingRequest;
import com.zenith.webapp.booking.dto.request.UpdateBookingRequest;
import com.zenith.webapp.booking.dto.response.BookingResponse;
import com.zenith.webapp.booking.enums.BookingStatus;
import com.zenith.webapp.booking.model.Booking;
import com.zenith.webapp.booking.repository.BookingRepository;
import com.zenith.webapp.facility.model.Resource;
import com.zenith.webapp.facility.repository.ResourceRepository;
import com.zenith.webapp.notification.dto.request.CreateNotificationRequest;
import com.zenith.webapp.notification.enums.NotificationType;
import com.zenith.webapp.notification.service.NotificationService;
import com.zenith.webapp.auth.model.User;
import com.zenith.webapp.auth.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ResourceRepository resourceRepository,
                          NotificationService notificationService) {  // ← add param
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;  // ← assign
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

                // ── AUTO-SEND NOTIFICATION ──────────────────────────────────────
        CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
        notificationRequest.setRecipientId(userId);
        notificationRequest.setType(NotificationType.BOOKING_CREATED);
        notificationRequest.setMessage("Your booking for \"" + resource.getName() + "\" has been submitted and is pending approval.");
        notificationRequest.setReferenceId(saved.getBooking_id());

        notificationService.createNotification(notificationRequest);

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
    public BookingResponse updateBooking(Long bookingId, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus(request.getStatus());
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
        public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status, String rejectionReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Resource resource = booking.getResource();
        String resourceName = resource.getName();
        
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        
        // Create notification
        CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
        notificationRequest.setRecipientId(booking.getUser().getUser_id());
        notificationRequest.setReferenceId(saved.getBooking_id());
        
        String message;
        NotificationType notificationType;
        
        switch (status) {
                case APPROVED:
                notificationType = NotificationType.BOOKING_APPROVED;
                message = String.format("✅ Your booking for \"%s\" has been APPROVED!", resourceName);
                break;
                case REJECTED:
                notificationType = NotificationType.BOOKING_REJECTED;
                if (rejectionReason != null && !rejectionReason.isEmpty()) {
                        message = String.format("❌ Your booking for \"%s\" has been REJECTED.\nReason: %s", resourceName, rejectionReason);
                } else {
                        message = String.format("❌ Your booking for \"%s\" has been REJECTED.", resourceName);
                }
                break;
                default:
                notificationType = NotificationType.BOOKING_CREATED;
                message = String.format("📋 Your booking for \"%s\" has been submitted and is pending approval.", resourceName);
                break;
        }
        
        notificationRequest.setType(notificationType);
        notificationRequest.setMessage(message);
        
        notificationService.createNotification(notificationRequest);
        
        return mapToResponse(saved);
        }

    public List<BookingResponse> getBookingsByUser(Long userId) {
    return bookingRepository.findBookingsByUserId(userId)
            .stream()
            .map(this::mapToResponse)
            .toList();
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




        // Convert directly without fromBooking
public List<BookingResponse> getBookingsByUser(Long userId, String status, String resource) {
        List<Booking> bookings = bookingRepository.findBookingsByUserId(userId);

        if (status != null && !status.isEmpty()) {
                bookings = bookings.stream()
                        .filter(b -> b.getStatus().name().equalsIgnoreCase(status))
                        .collect(Collectors.toList());
        }

        if (resource != null && !resource.isEmpty()) {
                bookings = bookings.stream()
                        .filter(b -> b.getResource().getName().equalsIgnoreCase(resource))
                        .collect(Collectors.toList());
        }

    List<BookingResponse> responses = new ArrayList<>();
        for (Booking b : bookings) {
                BookingResponse r = new BookingResponse();
                r.setBookingId(b.getBooking_id());
                r.setUserId(b.getUser().getUser_id());
                r.setUserName(b.getUser().getName());
                r.setResourceId(b.getResource().getId());
                r.setResourceName(b.getResource().getName());
                r.setStartTime(b.getStartTime());
                r.setEndTime(b.getEndTime());
                r.setPurpose(b.getPurpose());
                r.setAttendees(b.getAttendees());
                r.setStatus(b.getStatus().name());

                responses.add(r);
        }

        return responses;
        }
}