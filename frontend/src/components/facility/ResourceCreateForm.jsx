import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource } from "../../api/resourceApi";
import "./ResourceCreateForm.css";

const TYPES = [
  { value: "ROOM", label: "Room", icon: "🏢" },
  { value: "LAB", label: "Lab", icon: "🔬" },
  { value: "EQUIPMENT", label: "Equipment", icon: "⚙️" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Active", color: "#10b981" },
  { value: "OUT_OF_SERVICE", label: "Out of Service", color: "#ef4444" },
];

const initialForm = {
  name: "",
  type: "ROOM",
  capacity: 0,
  quantity: 0,
  location: "",
  availabilityWindow: "",
  status: "ACTIVE",
};

export default function ResourceCreateForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "quantity" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let validationErrors = {};

    if (!form.name || form.name.trim() === "") {
        validationErrors.name = "Resource name is required and cannot be empty.";
    }
    
    if (!form.location || form.location.trim() === "") {
        validationErrors.location = "Location is required and cannot be empty.";
    }

    if (form.type === 'ROOM' || form.type === 'LAB') {
        if (form.capacity <= 0) {
            validationErrors.capacity = "Capacity must be strictly greater than 0.";
        }
    } else if (form.type === 'EQUIPMENT') {
        if (form.quantity <= 0) {
            validationErrors.quantity = "Quantity must be strictly greater than 0.";
        }
    }

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setLoading(true);
    setError("");

    const payload = {
        ...form,
        capacity: form.type === 'EQUIPMENT' ? 0 : form.capacity
    };

    try {
      const created = await createResource(payload);
      navigate('/facilities', { 
        state: { successMessage: `Resource #${created.id} "${created.name}" created successfully!` } 
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="resource-form-container">
      <div className="resource-form-card">
        {/* Header */}
        <div className="resource-form-header">
          <div className="header-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="4" y="10" width="6" height="11" rx="1" />
              <rect x="14" y="6" width="6" height="15" rx="1" />
              <path d="M4 4v6M14 4v2M2 21h20" />
              <circle cx="17" cy="9" r="3" />
              <line x1="17" y1="7" x2="17" y2="11" />
              <line x1="15" y1="9" x2="19" y2="9" />
            </svg>
          </div>
          <div className="header-text">
            <h1>Add New Resource</h1>
            <p>Register a campus facility, room, or equipment to the catalogue</p>
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
        <form onSubmit={handleSubmit} className="resource-form">
          {/* Resource Name */}
          <div className="form-group">
            <label htmlFor="name">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Resource Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Conference Room A, Chemistry Lab 101"
              value={form.name}
              onChange={handleChange}
              required
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Two-column: Type & Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Type
              </label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Status
              </label>
              <div className="status-selector">
                {STATUSES.map((s) => (
                  <label
                    key={s.value}
                    className={`status-option ${form.status === s.value ? "status-active" : ""}`}
                    style={{ "--status-color": s.color }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      checked={form.status === s.value}
                      onChange={handleChange}
                    />
                    <span className="status-dot"></span>
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: Capacity/Quantity & Location */}
          <div className="form-row">
            <div className="form-group">
              {form.type === 'EQUIPMENT' ? (
                <>
                  <label htmlFor="quantity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-4.5M20 7v4.5M20 7l-5 5M4 17h4.5M4 17v-4.5M4 17l5-5" />
                    </svg>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={form.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "error" : ""}
                  />
                  {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                </>
              ) : (
                <>
                  <label htmlFor="capacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Capacity (People)
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="0"
                    placeholder="e.g., 30"
                    value={form.capacity}
                    onChange={handleChange}
                    className={errors.capacity ? "error" : ""}
                  />
                  {errors.capacity && <span className="error-text">{errors.capacity}</span>}
                </>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Building 2, Floor 3"
                value={form.location}
                onChange={handleChange}
                required
                className={errors.location ? "error" : ""}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          {/* Availability Window */}
          <div className="form-group">
            <label htmlFor="availabilityWindow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Availability Window
            </label>
            <input
              id="availabilityWindow"
              name="availabilityWindow"
              type="text"
              placeholder="e.g., Mon-Fri 8:00 AM - 6:00 PM"
              value={form.availabilityWindow}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Resource...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Resource
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="form-footer">
          <div className="footer-info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Resources are available for booking immediately</span>
          </div>
          <div className="footer-info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12v8H4v-8M12 2v10M8 8l4-4 4 4" />
            </svg>
            <span>All fields marked with * are required</span>
          </div>
        </div>
      </div>
    </div>
  );
}