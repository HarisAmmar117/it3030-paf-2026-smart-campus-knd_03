import { useState, useEffect } from "react";
import { createBooking, getAllResources, getBookings } from "../../api/BookingApi";
import "./BookingCreateForm.css";

const initialForm = {
  resourceId: "",
  date: "",
  timeSlot: "",
  purpose: "",
  attendees: 1,
};

// Generate time slots from 6 AM to 10 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 6; i <= 22; i++) {
    const startHour = i;
    const endHour = i + 1;
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    slots.push({
      value: `${startTime}-${endTime}`,
      label: `${startTime} - ${endTime}`,
      startTime: startTime,
      endTime: endTime,
      startHour: startHour,
      endHour: endHour
    });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Helper function to parse availability window in various formats
const parseAvailabilityWindow = (availabilityWindow) => {
  if (!availabilityWindow) return null;
  
  // Try different patterns
  
  // Pattern 1: "Mon-Fri 8:00 AM - 6:00 PM" or "8:00 AM - 6:00 PM"
  let match = availabilityWindow.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  
  // Pattern 2: "8 AM - 6 PM"
  if (!match) {
    match = availabilityWindow.match(/(\d{1,2})\s*(AM|PM)\s*-\s*(\d{1,2})\s*(AM|PM)/i);
    if (match) {
      let startHour = parseInt(match[1]);
      const startPeriod = match[2].toUpperCase();
      let endHour = parseInt(match[3]);
      const endPeriod = match[4].toUpperCase();
      
      // Convert to 24-hour format
      if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
      if (startPeriod === 'AM' && startHour === 12) startHour = 0;
      if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
      if (endPeriod === 'AM' && endHour === 12) endHour = 0;
      
      return { startHour, endHour };
    }
  }
  
  // Pattern 3: With minutes
  if (match) {
    let startHour = parseInt(match[1]);
    const startPeriod = match[3].toUpperCase();
    let endHour = parseInt(match[4]);
    const endPeriod = match[6].toUpperCase();
    
    // Convert to 24-hour format
    if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
    if (startPeriod === 'AM' && startHour === 12) startHour = 0;
    if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
    if (endPeriod === 'AM' && endHour === 12) endHour = 0;
    
    return { startHour, endHour };
  }
  
  // Pattern 4: "08:00-18:00" format
  match = availabilityWindow.match(/(\d{1,2}):(\d{2})\s*-?\s*(\d{1,2}):(\d{2})/);
  if (match) {
    let startHour = parseInt(match[1]);
    let endHour = parseInt(match[3]);
    return { startHour, endHour };
  }
  
  return null;
};

export default function BookingCreateForm() {
  const [form, setForm] = useState(initialForm);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);
      try {
        const data = await getAllResources();
        // Filter out OUT_OF_SERVICE resources
        const activeResources = (data || []).filter(r => r.status !== "OUT_OF_SERVICE");
        setResources(activeResources);
      } catch (err) {
        setError(err.message || "Failed to load resources");
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  // Fetch existing bookings for the selected resource and date
  useEffect(() => {
    const fetchBookings = async () => {
      if (!form.resourceId || !form.date) {
        setBookedSlots([]);
        return;
      }

      try {
        const allBookings = await getBookings();
        
        // Filter bookings for the selected resource and date
        // Only consider APPROVED bookings as booked slots (PENDING can be overridden? adjust as needed)
        const resourceBookings = allBookings.filter(booking => 
          booking.resourceId === parseInt(form.resourceId) &&
          booking.startTime.startsWith(form.date) &&
          booking.status !== "REJECTED" && 
          booking.status !== "CANCELLED"
        );
        
        // Extract booked time slots from the bookings
        const bookedTimeSlots = resourceBookings.map(booking => {
          // Get the start hour from the booking start time
          const startDateTime = new Date(booking.startTime);
          const startHour = startDateTime.getHours();
          const startHourStr = startHour.toString().padStart(2, '0');
          const endHourStr = (startHour + 1).toString().padStart(2, '0');
          return `${startHourStr}:00-${endHourStr}:00`;
        });
        
        // Remove duplicates (in case of multiple bookings for same slot)
        const uniqueBookedSlots = [...new Set(bookedTimeSlots)];
        
        setBookedSlots(uniqueBookedSlots);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    
    fetchBookings();
  }, [form.resourceId, form.date]);

  // Filter time slots based on resource availability window and existing bookings
  useEffect(() => {
    let filteredSlots = [...TIME_SLOTS];
    
    // Filter by availability window
    if (selectedResource && selectedResource.availabilityWindow) {
      const availability = selectedResource.availabilityWindow;
      const parsed = parseAvailabilityWindow(availability);
      
      if (parsed) {
        const { startHour, endHour } = parsed;
        filteredSlots = filteredSlots.filter(slot => 
          slot.startHour >= startHour && slot.endHour <= endHour
        );
      } else {
        // Default fallback: 8 AM to 8 PM
        filteredSlots = filteredSlots.filter(slot => 
          slot.startHour >= 8 && slot.endHour <= 20
        );
      }
    } else {
      // Default: 8 AM to 8 PM if no availability window
      filteredSlots = filteredSlots.filter(slot => 
        slot.startHour >= 8 && slot.endHour <= 20
      );
    }
    
    // Filter out already booked slots
    if (bookedSlots.length > 0) {
      const beforeCount = filteredSlots.length;
      filteredSlots = filteredSlots.filter(slot => !bookedSlots.includes(slot.value));
      console.log(`Removed ${beforeCount - filteredSlots.length} booked slots. Booked:`, bookedSlots);
    }
    
    setAvailableTimeSlots(filteredSlots);
    
    // Clear selected time slot if it's no longer available
    if (form.timeSlot && !filteredSlots.find(slot => slot.value === form.timeSlot)) {
      setForm(prev => ({ ...prev, timeSlot: "" }));
    }
  }, [selectedResource, bookedSlots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === "resourceId") {
      const resource = resources.find(r => r.id === parseInt(value));
      setSelectedResource(resource || null);
      setForm(prev => ({ ...prev, date: "", timeSlot: "" }));
      setBookedSlots([]);
    }
    
    if (name === "date") {
      setForm(prev => ({ ...prev, timeSlot: "" }));
    }
  };

  const validateAttendees = () => {
    if (!selectedResource) return true;
    
    if (selectedResource.type === 'EQUIPMENT') {
      if (form.attendees > selectedResource.quantity) {
        setError(`Only ${selectedResource.quantity} unit(s) available. Please reduce the quantity.`);
        return false;
      }
    } else {
      if (form.attendees > selectedResource.capacity) {
        setError(`Maximum capacity is ${selectedResource.capacity} people. Please reduce the number of attendees.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAttendees()) {
      setTimeout(() => setError(""), 4000);
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const selectedSlot = TIME_SLOTS.find(slot => slot.value === form.timeSlot);
      const startDateTime = `${form.date}T${selectedSlot.startTime}:00`;
      const endDateTime = `${form.date}T${selectedSlot.endTime}:00`;

      const payload = {
        resourceId: Number(form.resourceId),
        startTime: startDateTime,
        endTime: endDateTime,
        purpose: form.purpose,
        attendees: Number(form.attendees),
      };

      const created = await createBooking(payload, 2);
      setSuccess(`Booking #${created.id} created successfully`);
      setForm(initialForm);
      setSelectedResource(null);
      setBookedSlots([]);
      
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Unable to create booking. Please try again.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  const today = new Date().toISOString().split('T')[0];

  const getCapacityInfo = () => {
    if (!selectedResource) return null;
    if (selectedResource.type === 'EQUIPMENT') {
      return `${selectedResource.quantity} unit(s) available`;
    }
    return `Max ${selectedResource.capacity} people`;
  };

  const getMaxAttendees = () => {
    if (!selectedResource) return 100;
    return selectedResource.type === 'EQUIPMENT' ? selectedResource.quantity : selectedResource.capacity;
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="global-theme-toggle" aria-label="Toggle theme">
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div className="booking-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
          </div>
          <div className="header-text">
            <h1>New Booking</h1>
            <p>Schedule a resource reservation</p>
          </div>
        </div>

        {/* Resource Info Display */}
        {selectedResource && (
          <div className="resource-info-card">
            <div className="resource-info-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Resource Information</span>
            </div>
            <div className="resource-info-content">
              <div className="info-row">
                <strong>📍 Location:</strong> {selectedResource.location}
              </div>
              <div className="info-row">
                <strong>📊 {selectedResource.type === 'EQUIPMENT' ? 'Quantity' : 'Capacity'}:</strong> {getCapacityInfo()}
              </div>
              {selectedResource.availabilityWindow && (
                <div className="info-row">
                  <strong>🕒 Available Hours:</strong> {selectedResource.availabilityWindow}
                </div>
              )}
              <div className="info-row">
                <strong>📋 Type:</strong> {selectedResource.type}
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Resource Dropdown */}
          <div className="form-group">
            <label htmlFor="resourceId">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="10" width="6" height="11" rx="1" />
                <rect x="14" y="6" width="6" height="15" rx="1" />
                <path d="M4 4v6M14 4v2M2 21h20" />
              </svg>
              Select Resource
            </label>
            {loadingResources ? (
              <div className="skeleton-loading">Loading resources...</div>
            ) : (
              <select
                id="resourceId"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a resource...</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.type}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Selection */}
          <div className="form-group">
            <label htmlFor="date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Select Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div className="form-group">
            <label htmlFor="timeSlot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Select Time Slot
            </label>
            {!form.resourceId ? (
              <div className="time-slots-placeholder">Please select a resource first</div>
            ) : !form.date ? (
              <div className="time-slots-placeholder">Please select a date first</div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="time-slots-placeholder no-slots">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>No available time slots for this date</p>
                <small>Please select another date</small>
              </div>
            ) : (
              <>
                <div className="time-slots-grid">
                  {availableTimeSlots.map((slot) => (
                    <label
                      key={slot.value}
                      className={`time-slot-option ${form.timeSlot === slot.value ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.value}
                        checked={form.timeSlot === slot.value}
                        onChange={handleChange}
                      />
                      <span>{slot.label}</span>
                    </label>
                  ))}
                </div>
                {bookedSlots.length > 0 && (
                  <small className="hint-text">
                    ⚠️ {bookedSlots.length} time slot(s) already booked and removed from options
                  </small>
                )}
              </>
            )}
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label htmlFor="purpose">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Purpose
            </label>
            <input
              id="purpose"
              type="text"
              name="purpose"
              placeholder="e.g., Team meeting, Client presentation"
              value={form.purpose}
              onChange={handleChange}
              required
            />
          </div>

          {/* Attendees */}
          <div className="form-group">
            <label htmlFor="attendees">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {selectedResource?.type === 'EQUIPMENT' ? 'Quantity' : 'Number of Attendees'}
            </label>
            <div className="attendees-input-wrapper">
              <button 
                type="button" 
                onClick={() => setForm(prev => ({ ...prev, attendees: Math.max(1, prev.attendees - 1) }))}
                className="attendees-btn"
                disabled={!selectedResource}
              >
                -
              </button>
              <input
                id="attendees"
                type="number"
                name="attendees"
                min="1"
                max={getMaxAttendees()}
                value={form.attendees}
                onChange={handleChange}
                required
                disabled={!selectedResource}
              />
              <button 
                type="button" 
                onClick={() => setForm(prev => ({ ...prev, attendees: Math.min(getMaxAttendees(), prev.attendees + 1) }))}
                className="attendees-btn"
                disabled={!selectedResource || form.attendees >= getMaxAttendees()}
              >
                +
              </button>
            </div>
            {selectedResource && (
              <small className="hint-text">
                Max {getMaxAttendees()} {selectedResource.type === 'EQUIPMENT' ? 'units' : 'people'}
              </small>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || !form.resourceId || !form.date || !form.timeSlot || !form.purpose}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Booking
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="booking-footer">
          <div className="footer-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Slots are 1-hour blocks</span>
          </div>
          <div className="footer-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12v8H4v-8M12 2v10M8 8l4-4 4 4" />
            </svg>
            <span>Available during resource hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}