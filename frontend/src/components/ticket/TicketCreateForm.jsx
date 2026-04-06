import { useState } from "react";
import { createTicket } from "../../api/ticketApi";
import "./TicketCreateForm.css";

const CATEGORIES = [
  { value: "ELECTRICAL", label: "⚡ Electrical" },
  { value: "PLUMBING", label: "🔧 Plumbing" },
  { value: "NETWORK", label: "🌐 Network" },
  { value: "HARDWARE", label: "🖥️ Hardware" },
  { value: "SOFTWARE", label: "💻 Software" },
  { value: "SAFETY", label: "🛡️ Safety" },
  { value: "OTHER", label: "📋 Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "var(--priority-low)" },
  { value: "MEDIUM", label: "Medium", color: "var(--priority-medium)" },
  { value: "HIGH", label: "High", color: "var(--priority-high)" },
  { value: "CRITICAL", label: "Critical", color: "var(--priority-critical)" },
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
      const created = await createTicket(form, 101);
      setSuccess(`Ticket #${created.id} created successfully!`);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-wrapper fade-in">
      {/* Header */}
      <div className="ticket-form-header">
        <div className="ticket-form-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <div>
          <h2>Report an Issue</h2>
          <p className="ticket-form-subtitle">
            Submit a maintenance or incident ticket for campus facilities
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="ticket-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Issue Title</label>
          <input
            id="title"
            name="title"
            placeholder="e.g. Broken projector in Lecture Hall A"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide detailed information about the issue..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Two-column row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
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
          <label htmlFor="resourceLocation">Resource / Location</label>
          <input
            id="resourceLocation"
            name="resourceLocation"
            placeholder="e.g. Lab B, Room 302, Building 5"
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
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
}