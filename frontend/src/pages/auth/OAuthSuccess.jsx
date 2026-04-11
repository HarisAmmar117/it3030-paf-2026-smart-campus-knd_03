import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OAuthSuccess.css";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role");

    if (!token || !id) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("userName", name || "User");
    localStorage.setItem("userEmail", email || "");
    localStorage.setItem("role", role || "USER");

    // Determine redirect path based on role
    const userRole = String(role).toUpperCase();
    const redirectPath = userRole === "ADMIN" || userRole === "SUPPORT_STAFF" 
      ? "/tickets/admin" 
      : "/";

    // Redirect after a short delay
    setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 1500);
  }, [navigate]);

  if (error) {
    return (
      <div className="oauth-container">
        <div className="oauth-card error">
          <div className="oauth-icon error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2>Authentication Failed</h2>
          <p>{error}</p>
          <p className="redirect-message">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-container">
      <div className="oauth-card">
        <div className="oauth-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="spinner"></div>
        <h2>Logging you in...</h2>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}