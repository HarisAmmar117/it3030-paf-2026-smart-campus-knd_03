import { useState } from "react";
import { createTicket } from "../../api/ticketApi";

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
    setSuccess("Ticket created successfully. Ticket ID: " + created.id);
    setForm(initialForm);
    } catch (err) {
    setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <h2>Create Maintenance Ticket</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        required
      />

      <input
        name="resourceLocation"
        placeholder="Resource / Location"
        value={form.resourceLocation}
        onChange={handleChange}
        required
      />

      <input
        name="preferredContactDetails"
        placeholder="Preferred Contact Details"
        value={form.preferredContactDetails}
        onChange={handleChange}
        required
      />

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="ELECTRICAL">ELECTRICAL</option>
        <option value="PLUMBING">PLUMBING</option>
        <option value="NETWORK">NETWORK</option>
        <option value="HARDWARE">HARDWARE</option>
        <option value="SOFTWARE">SOFTWARE</option>
        <option value="SAFETY">SAFETY</option>
        <option value="OTHER">OTHER</option>
      </select>

      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Ticket"}
      </button>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {success ? <p style={{ color: "green" }}>{success}</p> : null}
    </form>
  );
}