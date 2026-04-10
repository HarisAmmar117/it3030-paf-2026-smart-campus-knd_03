import { Link } from "react-router-dom";
import "./AboutUs.css";

export default function AboutUs() {
  const teamValues = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To revolutionize campus operations through innovative technology, making resource management seamless, efficient, and accessible for everyone in the academic community."
    },
    {
      icon: "👁️",
      title: "Our Vision",
      description: "To become the leading smart campus solution provider, empowering educational institutions worldwide with cutting-edge technology and exceptional user experiences."
    },
    {
      icon: "💡",
      title: "Our Values",
      description: "Innovation, transparency, collaboration, excellence, and a commitment to sustainability in everything we do."
    }
  ];

  const technologies = [
    { name: "Spring Boot", icon: "☕", color: "#6DB33F", description: "Backend Framework" },
    { name: "React", icon: "⚛️", color: "#61DAFB", description: "Frontend Library" },
    { name: "MySQL", icon: "🐬", color: "#00758D", description: "Database" },
    { name: "OAuth 2.0", icon: "🔐", color: "#e67e22", description: "Authentication" },
    { name: "JWT", icon: "🔑", color: "#000000", description: "Security" },
    { name: "GitHub Actions", icon: "⚡", color: "#2088FF", description: "CI/CD" },
    { name: "Docker", icon: "🐳", color: "#2496ED", description: "Containerization" },
    { name: "REST API", icon: "🔄", color: "#e67e22", description: "API Architecture" }
  ];

  const features = [
    {
      icon: "🏢",
      title: "Facility Management",
      description: "Efficiently manage all campus resources including rooms, labs, and equipment with real-time availability tracking."
    },
    {
      icon: "📅",
      title: "Smart Booking",
      description: "Intelligent booking system with conflict detection, approval workflows, and automated notifications."
    },
    {
      icon: "🎫",
      title: "Incident Tracking",
      description: "Streamlined ticket management for maintenance requests, with attachments, comments, and status updates."
    },
    {
      icon: "🔔",
      title: "Real-time Alerts",
      description: "Instant notifications for booking approvals, ticket updates, and important announcements."
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Comprehensive insights into resource utilization, booking patterns, and system performance."
    },
    {
      icon: "🛡️",
      title: "Secure Access",
      description: "Role-based access control with OAuth 2.0 authentication for maximum security."
    }
  ];

  const milestones = [
    { year: "2024", title: "Idea Conception", description: "The vision for Smart Campus Hub was born" },
    { year: "2025", title: "Development Started", description: "Core modules development began" },
    { year: "2026", title: "Official Launch", description: "Platform launched with 4 core modules" },
    { year: "2027", title: "Expansion", description: "Planned expansion to 50+ institutions" }
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
              and maintenance requests. Students waste time searching for available rooms, 
              staff juggle multiple spreadsheets, and administrators lack visibility into 
              campus operations.
            </p>
            <p>
              We set out to create a unified platform that brings everything together in one 
              intuitive interface. Our team of experienced developers, UI/UX designers, and 
              education technology experts worked closely with university staff to understand 
              their pain points and design solutions that truly address real-world needs.
            </p>
            <p>
              Today, we're proud to help institutions streamline their operations, reduce 
              administrative overhead, and provide better experiences for students, faculty, 
              and staff. With a 98% satisfaction rate and growing, we're just getting started.
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
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">What We Offer</span>
          <h2>Comprehensive Solutions</h2>
          <p>Everything you need to manage your campus efficiently</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="values-section">
        <div className="section-header">
          <span className="section-badge">Our Core</span>
          <h2>What Drives Us</h2>
          <p>The principles that guide our every decision</p>
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

      {/* Milestones Section */}
      <section className="milestones-section">
        <div className="section-header">
          <span className="section-badge">Our Journey</span>
          <h2>Key Milestones</h2>
          <p>The path that brought us here</p>
        </div>
        <div className="milestones-timeline">
          {milestones.map((milestone, index) => (
            <div className="milestone-item" key={index}>
              <div className="milestone-year">{milestone.year}</div>
              <div className="milestone-content">
                <h4>{milestone.title}</h4>
                <p>{milestone.description}</p>
              </div>
              {index < milestones.length - 1 && <div className="milestone-connector"></div>}
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
              <span className="tech-desc">{tech.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <span className="section-badge">Our Team</span>
          <h2>Meet the Minds Behind the Platform</h2>
          <p>Dedicated professionals committed to your success</p>
        </div>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">👨‍💻</div>
            <h4>Development Team</h4>
            <p>Full-stack developers with expertise in Spring Boot and React</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">🎨</div>
            <h4>Design Team</h4>
            <p>UI/UX specialists focused on creating intuitive experiences</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">🛡️</div>
            <h4>Security Team</h4>
            <p>Experts ensuring your data remains safe and secure</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">💬</div>
            <h4>Support Team</h4>
            <p>24/7 customer support ready to assist you</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Campus?</h2>
          <p>Join over 50+ institutions already using Smart Campus Hub</p>
          <div className="cta-buttons">
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
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}