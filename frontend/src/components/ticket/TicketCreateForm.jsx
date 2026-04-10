import { useState } from "react";
import { createTicket } from "../../api/ticketApi";
import { getCurrentUserId } from "../../utils/authSession";
import "./TicketCreateForm.css";

const CATEGORIES = [
  { value: "ELECTRICAL", label: "Electrical", icon: "⚡" },
  { value: "PLUMBING", label: "Plumbing", icon: "🔧" },
  { value: "NETWORK", label: "Network", icon: "🌐" },
  { value: "HARDWARE", label: "Hardware", icon: "🖥️" },
  { value: "SOFTWARE", label: "Software", icon: "💻" },
  { value: "SAFETY", label: "Safety", icon: "🛡️" },
  { value: "OTHER", label: "Other", icon: "📋" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "#10b981" },
  { value: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { value: "HIGH", label: "High", color: "#ef4444" },
];

const initialForm = {
  title: "",
  description: "",
  resourceLocation: "",
  preferredContactDetails: "",
  category: "HARDWARE",
  priority: "HIGH",
};

export default function TicketCreateForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "preferredContactDetails") {
      setContactError("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate contact: email OR +94 followed by exactly 9 digits
  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+94\d{9}$/;
    if (emailRegex.test(value) || phoneRegex.test(value.replace(/\s/g, ""))) {
      return "";
    }
    return "Enter a valid email (e.g. john@campus.edu) or phone (+94XXXXXXXXX)";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate contact before submitting
    const contactErr = validateContact(form.preferredContactDetails);
    if (contactErr) {
      setContactError(contactErr);
      return;
    }
    setContactError("");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        throw new Error("User session not found. Please log in again.");
      }

      const created = await createTicket(form, currentUserId);
      setSuccess(`Ticket #${created.id} created successfully!`);
      setForm(initialForm);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-container">
      <div className="ticket-form-card">
        {/* Header */}
        <div className="ticket-form-header">
          <div className="header-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>Report an Issue</h1>
            <p>Submit a maintenance or incident ticket for campus facilities</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="ticket-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Issue Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Broken projector in Lecture Hall A"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the issue including what happened, when, and any relevant details..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* Two-column row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Priority
              </label>
              <div className="priority-selector">
                {PRIORITIES.map((p) => (
                  <label
                    key={p.value}
                    className={`priority-option ${form.priority === p.value ? "priority-active" : ""}`}
                    style={{ "--priority-color": p.color }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      checked={form.priority === p.value}
                      onChange={handleChange}
                    />
                    <span className="priority-dot"></span>
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="resourceLocation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Resource / Location
            </label>
            <input
              id="resourceLocation"
              name="resourceLocation"
              type="text"
              placeholder="e.g., Lab B, Room 302, Building 5"
              value={form.resourceLocation}
              onChange={handleChange}
              required
            />
          </div>

        {/* Contact */}
        <div className="form-group">
          <label htmlFor="preferredContactDetails">Contact Details</label>
          <input
            id="preferredContactDetails"
            name="preferredContactDetails"
            placeholder="e.g. john@campus.edu or +94 77 123 4567"
            value={form.preferredContactDetails}
            onChange={handleChange}
            className={contactError ? "input-invalid" : ""}
            aria-invalid={Boolean(contactError)}
            aria-describedby={contactError ? "contact-error" : undefined}
            required
          />
          {contactError ? (
            <p id="contact-error" className="field-error">{contactError}</p>
          ) : null}
        </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Ticket...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Ticket
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="form-footer">
          <div className="footer-info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Average response time: &lt; 2 hours</span>
          </div>
          <div className="footer-info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12v8H4v-8M12 2v10M8 8l4-4 4 4"/>
            </svg>
            <span>24/7 Support Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}