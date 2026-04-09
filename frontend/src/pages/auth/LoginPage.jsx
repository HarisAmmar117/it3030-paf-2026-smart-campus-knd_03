import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Login failed");

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("userId", String(data.id));
      localStorage.setItem("role", String(data.role || "USER"));
      localStorage.setItem("userName", String(data.name || ""));
      localStorage.setItem("userEmail", String(data.email || ""));

      if (["ADMIN", "SUPPORT_STAFF"].includes(String(data.role).toUpperCase())) {
        navigate("/tickets/admin", { replace: true });
      } else {
        navigate("/tickets", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 24 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      {error ? <p style={{ color: "crimson", marginTop: 10 }}>{error}</p> : null}
    </div>
  );
}