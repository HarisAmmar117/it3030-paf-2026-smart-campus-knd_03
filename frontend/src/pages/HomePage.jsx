import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const features = [
    {
      icon: "🏢",
      title: "Facilities & Assets",
      description: "Browse and manage campus resources including lecture halls, labs, meeting rooms, and equipment.",
      link: "/facilities",
      color: "#3b82f6"
    },
    {
      icon: "📅",
      title: "Booking Management",
      description: "Request bookings, check availability, and manage your reservations seamlessly.",
      link: "/bookings",
      color: "#e67e22"
    },
    {
      icon: "🎫",
      title: "Incident Tickets",
      description: "Report issues, track maintenance requests, and get real-time updates on resolutions.",
      link: "/tickets",
      color: "#ef4444"
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Stay informed with real-time alerts for approvals, status changes, and updates.",
      link: "/notifications",
      color: "#10b981"
    }
  ];

  const stats = [
    { value: "500+", label: "Resources Available" },
    { value: "10K+", label: "Bookings Completed" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="homepage">
      {/* Global Theme Toggle */}


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Smart Campus Operations Hub</span>
        </div>
        <h1 className="hero-title">
          Modernizing <span className="highlight">Campus Operations</span>
        </h1>
        <p className="hero-subtitle">
          A complete platform to manage facility bookings, incident tickets, 
          and campus resources efficiently.
        </p>
        <div className="hero-buttons">
          <Link to="/facilities" className="btn-primary-hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Explore Resources
          </Link>
          <Link to="/tickets/create" className="btn-secondary-hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Report Issue
          </Link>
        </div>
        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">Core Modules</span>
          <h2>Everything You Need</h2>
          <p>Comprehensive tools to streamline campus operations</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link to={feature.link} className="feature-card" key={index}>
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                <span className="feature-emoji">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-link">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2>Simple & Efficient Workflow</h2>
          <p>From request to resolution in just a few steps</p>
        </div>
        <div className="workflow-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h4>Submit Request</h4>
            <p>Create a booking or incident ticket</p>
          </div>
          <div className="step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">✅</div>
            <h4>Admin Review</h4>
            <p>Approve/assign or escalate</p>
          </div>
          <div className="step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">🔧</div>
            <h4>Processing</h4>
            <p>Technician assigned or resource booked</p>
          </div>
          <div className="step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">🎉</div>
            <h4>Resolution</h4>
            <p>Complete and get notified</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join the Smart Campus Operations Hub today and experience seamless management.</p>
          <Link to="/facilities" className="btn-primary-hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Explore Resources
          </Link>
        </div>
      </section>
    </div>
  );
}