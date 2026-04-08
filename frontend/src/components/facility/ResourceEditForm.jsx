import { useState, useEffect } from "react";
import { getResourceById, updateResource } from "../../api/resourceApi";
import { useNavigate } from "react-router-dom";
import "./ResourceCreateForm.css"; // Reuse existing styles

const TYPES = [
  { value: "ROOM", label: "🏢 Room" },
  { value: "LAB", label: "🔬 Lab" },
  { value: "EQUIPMENT", label: "⚙️ Equipment" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Active", color: "#059669" },
  { value: "OUT_OF_SERVICE", label: "Out of Service", color: "#dc2626" },
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

export default function ResourceEditForm({ resourceId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadResource() {
      setFetching(true);
      try {
        const data = await getResourceById(resourceId);
        if (data) {
          setForm({
            name: data.name || "",
            type: data.type || "ROOM",
            capacity: data.capacity || 0,
            quantity: data.quantity || 0,
            location: data.location || "",
            availabilityWindow: data.availabilityWindow || "",
            status: data.status || "ACTIVE",
          });
        } else {
          setError("Resource not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load resource data");
      } finally {
        setFetching(false);
      }
    }
    if (resourceId) {
      loadResource();
    }
  }, [resourceId]);

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

    // Force capacity to 0 if EQUIPMENT
    const payload = {
        ...form,
        capacity: form.type === 'EQUIPMENT' ? 0 : form.capacity
    };

    try {
      const updated = await updateResource(resourceId, payload);
      // Navigate to /facilities and pass success message via state
      navigate('/facilities', { 
        state: { successMessage: `Resource #${updated.id} "${updated.name}" updated successfully!` } 
      });
    } catch (err) {
      setError(err.message || "Something went wrong during update");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="resource-form-wrapper fade-in" style={{ padding: "48px", textAlign: "center" }}>
        <p>Loading resource data...</p>
      </div>
    );
  }

  return (
    <div className="resource-form-wrapper fade-in">
      {/* Header */}
      <div className="resource-form-header">
        <div className="resource-form-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <div>
          <h2>Update Resource #{resourceId}</h2>
          <p className="resource-form-subtitle">
            Modify details for the selected campus facility, room, or equipment
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
      <form onSubmit={handleSubmit} className="resource-form">
        {/* Resource Name */}
        <div className="form-group">
          <label htmlFor="name">Resource Name</label>
          <input
            id="name"
            name="name"
            placeholder="e.g. Conference Room A, Chemistry Lab 101"
            value={form.name}
            onChange={handleChange}
            required
            style={errors.name ? { borderColor: '#dc2626' } : {}}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Two-column: Type & Status */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
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
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  value={form.quantity}
                  onChange={handleChange}
                  style={errors.quantity ? { borderColor: '#dc2626' } : {}}
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </>
            ) : (
              <>
                <label htmlFor="capacity">Capacity (People)</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  value={form.capacity}
                  onChange={handleChange}
                  style={errors.capacity ? { borderColor: '#dc2626' } : {}}
                />
                {errors.capacity && <span className="error-text">{errors.capacity}</span>}
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              placeholder="e.g. Building 2, Floor 3"
              value={form.location}
              onChange={handleChange}
              required
              style={errors.location ? { borderColor: '#dc2626' } : {}}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
        </div>

        {/* Availability Window */}
        <div className="form-group">
          <label htmlFor="availabilityWindow">Availability Window</label>
          <input
            id="availabilityWindow"
            name="availabilityWindow"
            placeholder="e.g. Mon-Fri 8:00 AM - 6:00 PM"
            value={form.availabilityWindow}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Updating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Changes
            </>
          )}
        </button>

        <button 
          type="button" 
          className="btn-secondary" 
          style={{ width: "100%" }} 
          onClick={() => navigate("/facilities")}
        >
          Cancel and Return
        </button>
      </form>
    </div>
  );
}
