package com.zenith.webapp.booking.service.impl;

import org.springframework.stereotype.Service;

import com.zenith.webapp.auth.repository.UserRepository;
import com.zenith.webapp.booking.dto.request.BookingRequest;
import com.zenith.webapp.booking.dto.response.BookingResponse;
import com.zenith.webapp.booking.model.Booking;
import com.zenith.webapp.booking.repository.BookingRepository;
import com.zenith.webapp.facility.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingResponse createBooking(BookingRequest request) {

        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        boolean conflict = !bookingRepository
                .findByResourceIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        resource.getId(),
                        request.getEndTime(),
                        request.getStartTime()
                ).isEmpty();

        if (conflict) {
            throw new RuntimeException("Time slot already booked!");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());

        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {

        BookingResponse res = new BookingResponse();

        res.setBookingId(booking.getBooking_id());

        res.setUserId(booking.getUser().getUser_id());
        res.setUserName(booking.getUser().getName());

        res.setResourceId(booking.getResource().getId());
        res.setResourceName(booking.getResource().getName());

        res.setStartTime(booking.getStartTime());
        res.setEndTime(booking.getEndTime());

        res.setPurpose(booking.getPurpose());
        res.setAttendees(booking.getAttendees());

        res.setStatus(booking.getStatus().name());

        return res;
    }
}