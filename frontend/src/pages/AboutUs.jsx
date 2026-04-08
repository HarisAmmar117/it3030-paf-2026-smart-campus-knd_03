import { Link } from "react-router-dom";
import "./AboutUs.css";

export default function AboutUs() {
  const teamValues = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To revolutionize campus operations through innovative technology, making resource management seamless and efficient for everyone."
    },
    {
      icon: "👁️",
      title: "Our Vision",
      description: "To become the leading smart campus solution provider, empowering educational institutions worldwide."
    },
    {
      icon: "💡",
      title: "Our Values",
      description: "Innovation, transparency, collaboration, and excellence in everything we do."
    }
  ];

  const technologies = [
    { name: "Spring Boot", icon: "☕", color: "#6DB33F" },
    { name: "React", icon: "⚛️", color: "#61DAFB" },
    { name: "PostgreSQL", icon: "🐘", color: "#336791" },
    { name: "OAuth 2.0", icon: "🔐", color: "#e67e22" },
    { name: "JWT", icon: "🔑", color: "#000000" },
    { name: "GitHub Actions", icon: "⚡", color: "#2088FF" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>About Us</span>
        </div>
        <h1>Smart Campus<br />Operations Hub</h1>
        <p>Empowering educational institutions with modern technology solutions</p>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2026, Smart Campus Operations Hub was born from a simple observation: 
              universities struggle with fragmented systems for managing facilities, bookings, 
              and maintenance requests. We set out to create a unified platform that brings 
              everything together.
            </p>
            <p>
              Today, we're proud to help institutions streamline their operations, reduce 
              administrative overhead, and provide better experiences for students, faculty, 
              and staff.
            </p>
          </div>
          <div className="story-stats">
            <div className="stat-card">
              <span className="stat-number">2026</span>
              <span className="stat-label">Year Founded</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4+</span>
              <span className="stat-label">Core Modules</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="values-section">
        <div className="section-header">
          <span className="section-badge">Our Core</span>
          <h2>What Drives Us</h2>
        </div>
        <div className="values-grid">
          {teamValues.map((value, index) => (
            <div className="value-card" key={index}>
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section">
        <div className="section-header">
          <span className="section-badge">Tech Stack</span>
          <h2>Built With Modern Technology</h2>
          <p>Enterprise-grade tools for enterprise-grade solutions</p>
        </div>
        <div className="tech-grid">
          {technologies.map((tech, index) => (
            <div className="tech-card" key={index}>
              <span className="tech-icon">{tech.icon}</span>
              <span className="tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Campus?</h2>
          <p>Join the growing number of institutions using Smart Campus Hub</p>
          <Link to="/facilities" className="btn-primary-hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}