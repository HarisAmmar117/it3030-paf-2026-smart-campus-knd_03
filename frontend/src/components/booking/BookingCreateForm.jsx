import { useState, useEffect } from "react";
import { createBooking, getAllResources } from "../../api/BookingApi";
import "./BookingCreateForm.css";

const initialForm = {
  resourceId: "",
  startTime: "",
  endTime: "",
  purpose: "",
  attendees: 1,
};

export default function BookingCreateForm() {
  const [form, setForm] = useState(initialForm);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
        setResources(data || []);
      } catch (err) {
        setError(err.message || "Failed to load resources");
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        resourceId: Number(form.resourceId),
        attendees: Number(form.attendees),
      };

      const created = await createBooking(payload, 2);
      setSuccess(`Booking #${created.id} created successfully`);
      setForm(initialForm);
      
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Unable to create booking. Please try again.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="booking-container">
      <div className="booking-card">

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
            <label htmlFor="resourceId">Resource</label>
            {loadingResources ? (
              <div className="skeleton-loading">Loading resources...</div>
            ) : (
              <select
                id="resourceId"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                required
                className={!form.resourceId ? "empty" : ""}
              >
                <option value="">Select resource</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.type}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start time</label>
              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End time</label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
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
            <label htmlFor="attendees">Attendees</label>
            <input
              id="attendees"
              type="number"
              name="attendees"
              min="1"
              value={form.attendees}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "Create booking"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="booking-footer">
          <span>Need help? <a href="#">Contact support</a></span>
          <span>v2.0</span>
        </div>
      </div>
    </div>
  );
}