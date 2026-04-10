import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role");

    if (!token || !id) {
      setError("Authentication failed");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // 1. Store auth
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("userName", name || "User");
    localStorage.setItem("userEmail", email || "");
    localStorage.setItem("role", role || "USER");

    // 2. Wait BEFORE redirect (IMPORTANT FIX)
    setTimeout(() => {
      navigate("/", { replace: true });
      window.location.reload(); // 🔥 forces auth refresh
    }, 500);
  }, [navigate]);

  if (error) return <h3>{error}</h3>;

  return <h3>Logging you in...</h3>;
}