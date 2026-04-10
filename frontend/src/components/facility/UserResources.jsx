import React, { useState, useEffect, useCallback } from 'react';
import { getResources } from '../../api/resourceApi';
import ResourceCard from './ResourceCard';
import './ResourceList.css';

const TYPE_OPTIONS = ['', 'ROOM', 'LAB', 'EQUIPMENT'];

const UserResources = () => {
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '', location: '', minCapacity: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const filteredResources = resources.filter((r) => {
        // Location filter (exact or partial text march, separate from general search)
        if (filters.location) {
            const locQuery = filters.location.toLowerCase();
            if (!r.location || !r.location.toLowerCase().includes(locQuery)) return false;
        }

        // Capacity filter (covers both capacities for rooms and quantities for eqp)
        if (filters.minCapacity) {
            const threshold = parseInt(filters.minCapacity, 10);
            if (!isNaN(threshold)) {
                const currentCap = r.type === 'EQUIPMENT' ? (r.quantity || 0) : (r.capacity || 0);
                if (currentCap < threshold) return false;
            }
        }

        // General search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                r.name?.toLowerCase().includes(q) ||
                r.location?.toLowerCase().includes(q) ||
                r.availabilityWindow?.toLowerCase().includes(q);
            if (!matchesSearch) return false;
        }

        return true;
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
                        <h2>Resource Catalogue (User View)</h2>
                        <p>Browse available campus facilities and equipment.</p>
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
                        placeholder="Search by name"
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
                <div className="filter-group">
                    <label>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        placeholder="e.g. Floor 4"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-group">
                    <label>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Min Capacity
                    </label>
                    <input
                        type="number"
                        name="minCapacity"
                        placeholder="e.g. 10"
                        min="0"
                        value={filters.minCapacity}
                        onChange={handleFilterChange}
                    />
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

            {/* Error alerts */}
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
                    <p>Try changing your search or filters.</p>
                </div>
            )}

            {/* Resource Cards */}
            {!loading && (
                <div className="resource-grid">
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            isAdmin={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserResources;
