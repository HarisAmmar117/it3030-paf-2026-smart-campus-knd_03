import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResources, deleteResource } from '../../api/resourceApi';
import './ResourceList.css';

const TYPE_OPTIONS = ['', 'ROOM', 'LAB', 'EQUIPMENT'];

function statusClass(status) {
  return `badge badge-${String(status || '').toLowerCase().replaceAll('_', '-')}`;
}

// SVG Icon components for different resource types
const ResourceIcon = ({ type, name }) => {
  const iconProps = { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" };
  
  // Room icon
  if (type === 'ROOM') {
    return (
      <svg {...iconProps}>
        <rect x="4" y="10" width="6" height="11" rx="1" />
        <rect x="14" y="6" width="6" height="15" rx="1" />
        <path d="M4 4v6M14 4v2M2 21h20" />
      </svg>
    );
  }
  
  // Lab icon
  if (type === 'LAB') {
    return (
      <svg {...iconProps}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  
  // Equipment icon
  if (type === 'EQUIPMENT') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    );
  }
  
  // Default icon
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
};

const ResourceList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccessMessage(location.state.successMessage);
            window.history.replaceState({}, document.title);
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const loadResources = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getResources({ type: filters.type });
            setResources(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Unable to load resources');
        } finally {
            setLoading(false);
        }
    }, [filters.type]);

    useEffect(() => {
        loadResources();
    }, [loadResources]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const onApplyFilters = (e) => {
        e.preventDefault();
        loadResources();
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this resource?');
        if (!confirmed) return;

        try {
            await deleteResource(id);
            await loadResources();
        } catch (err) {
            setError(err.message || 'Failed to delete resource');
        }
    };

    const filteredResources = resources.filter((r) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.name?.toLowerCase().includes(q) ||
            r.location?.toLowerCase().includes(q) ||
            r.availabilityWindow?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="resource-list-shell fade-in">
            {/* Header */}
            <div className="resource-list-header">
                <div className="header-left">
                    <div className="header-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <rect x="4" y="10" width="6" height="11" rx="1" />
                            <rect x="14" y="6" width="6" height="15" rx="1" />
                            <path d="M4 4v6M14 4v2M2 21h20" />
                        </svg>
                    </div>
                    <div>
                        <h2>Resource Catalogue</h2>
                        <p>Review available campus facilities and assets in real time.</p>
                    </div>
                </div>
                <button type="button" className="refresh-btn" onClick={loadResources} disabled={loading}>
                    {loading ? (
                        <span className="spinner-small"></span>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </>
                    )}
                </button>
            </div>

            {/* Filters */}
            <form className="resource-filters" onSubmit={onApplyFilters}>
                <div className="filter-group">
                    <label>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        Type
                    </label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        {TYPE_OPTIONS.map((t) => (
                            <option key={t || 'ALL'} value={t}>{t || 'ALL'}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-actions">
                    <button type="submit" className="apply-btn" disabled={loading}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Apply Filters
                    </button>
                </div>
            </form>

            {/* Error & Success alerts */}
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
            {successMessage && (
                <div className="alert alert-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading resources...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredResources.length === 0 && (
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="4" y="10" width="6" height="11" rx="1" />
                        <rect x="14" y="6" width="6" height="15" rx="1" />
                        <path d="M4 4v6M14 4v2M2 21h20" />
                    </svg>
                    <h3>No resources found</h3>
                    <p>Try changing filters or add a new resource using the "Add Resource" tab.</p>
                </div>
            )}

            {/* Resource Cards */}
            {!loading && (
                <div className="resource-grid">
                    {filteredResources.map((resource) => (
                        <article className="resource-card" key={resource.id}>
                            {/* Resource Icon */}
                            <div className="resource-card-icon">
                                <ResourceIcon type={resource.type} name={resource.name} />
                                <span className={`resource-type-badge ${resource.type.toLowerCase()}`}>
                                    {resource.type}
                                </span>
                            </div>

                            <div className="resource-card-body">
                                <div className="resource-card-header">
                                    <div className="resource-title">
                                        <span className="resource-id">#{resource.id}</span>
                                        <h3>{resource.name}</h3>
                                    </div>
                                    <span className={statusClass(resource.status)}>
                                        {resource.status}
                                    </span>
                                </div>

                                <div className="resource-meta-grid">
                                    <div className="meta-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span>{resource.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                        </svg>
                                        <span>{resource.type}</span>
                                    </div>
                                    {resource.type === 'EQUIPMENT' ? (
                                        <div className="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 7h-4.5M20 7v4.5M20 7l-5 5M4 17h4.5M4 17v-4.5M4 17l5-5" />
                                            </svg>
                                            <span>Quantity: {resource.quantity > 0 ? resource.quantity : 'N/A'}</span>
                                        </div>
                                    ) : (
                                        <div className="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            <span>Capacity: {resource.capacity > 0 ? `${resource.capacity} People` : 'N/A'}</span>
                                        </div>
                                    )}
                                    {resource.availabilityWindow && (
                                        <div className="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>{resource.availabilityWindow}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="resource-actions">
                                    <button 
                                        type="button" 
                                        className="action-btn edit"
                                        onClick={() => navigate(`/facilities/edit/${resource.id}`)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                                            <path d="M4 20h16" />
                                        </svg>
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="action-btn delete"
                                        onClick={() => handleDelete(resource.id)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                                            <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;