import { useState } from "react";
import { createBooking } from "../../api/BookingApi";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      setSuccess(`Booking #${created.id} created successfully!`);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-wrapper fade-in">

      {/* Header */}
      <div className="booking-form-header">
        <div className="booking-form-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <h2>Create Booking</h2>
          <p className="booking-form-subtitle">
            Reserve rooms, labs, or equipment
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="booking-form">

        {/* Resource ID */}
        <div className="form-group">
          <label htmlFor="resourceId">Resource ID</label>
          <input
            id="resourceId"
            name="resourceId"
            type="number"
            placeholder="Enter resource ID"
            value={form.resourceId}
            onChange={handleChange}
            required
          />
        </div>

        {/* Time Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
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
            <label htmlFor="endTime">End Time</label>
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
            name="purpose"
            placeholder="e.g. Team meeting, lab session"
            value={form.purpose}
            onChange={handleChange}
            required
          />
        </div>

        {/* Attendees */}
        <div className="form-group">
          <label htmlFor="attendees">Number of Attendees</label>
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

        {/* Submit */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Creating..." : "Create Booking"}
        </button>

      </form>
    </div>
  );
}