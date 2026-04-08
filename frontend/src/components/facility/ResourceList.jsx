import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResources, deleteResource } from '../../api/resourceApi';
import './ResourceList.css';

import roomImg from '../../assets/room.png';
import equipmentImg from '../../assets/equipment.png';
import labImg from '../../assets/lab.png';
import projectorImg from '../../assets/projector.png';
import conferenceRoomImg from '../../assets/conference_room.png';
import chemistryLabImg from '../../assets/chemistry_lab.png';
import paSystemImg from '../../assets/pa_system.png';
import lectureHallImg from '../../assets/lecture_hall.png';
import computerLabImg from '../../assets/computer_lab.png';
import studyRoomImg from '../../assets/study_room.png';
import macWorkstationImg from '../../assets/mac_workstation.png';
import networkLabImg from '../../assets/network_lab.png';
import dataScienceLabImg from '../../assets/data_science_lab.png';
import dslrCameraImg from '../../assets/dslr_camera.png';
import printerImg from '../../assets/3d_printer.png';

// Fallback by type
const TYPE_IMAGES = {
  ROOM: roomImg,
  LAB: labImg,
  EQUIPMENT: equipmentImg,
};

// Keyword-based image matching for specific resources
const KEYWORD_IMAGES = [
  { keywords: ['projector'],               image: projectorImg },
  { keywords: ['conference', 'meeting'],    image: conferenceRoomImg },
  { keywords: ['chemistry', 'chem'],        image: chemistryLabImg },
  { keywords: ['pa system', 'speaker', 'microphone', 'sound', 'audio'], image: paSystemImg },
  { keywords: ['lecture', 'auditorium', 'hall'], image: lectureHallImg },
  { keywords: ['computer', 'cs lab', 'workstation', 'it lab'], image: computerLabImg },
  { keywords: ['study', 'library', 'quiet'], image: studyRoomImg },
  { keywords: ['mac', 'mobile app', 'app dev', 'imac', 'macbook'], image: macWorkstationImg },
  { keywords: ['network', 'networking', 'cisco', 'router'], image: networkLabImg },
  { keywords: ['data science', 'data analytics', 'machine learning', 'ai lab'], image: dataScienceLabImg },
  { keywords: ['dslr', 'camera', 'photography', 'video kit'], image: dslrCameraImg },
  { keywords: ['3d printer', 'printer', 'extruder', 'makerspace'], image: printerImg },
];

function getResourceImage(resource) {
  const name = (resource.name || '').toLowerCase();
  for (const entry of KEYWORD_IMAGES) {
    if (entry.keywords.some((kw) => name.includes(kw))) {
      return entry.image;
    }
  }
  // Fallback to type-based image
  return TYPE_IMAGES[resource.type] || roomImg;
}

const TYPE_OPTIONS = ['', 'ROOM', 'LAB', 'EQUIPMENT'];

function statusClass(status) {
  return `badge badge-${String(status || '').toLowerCase().replaceAll('_', '-')}`;
}

const ResourceList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Check for success message from navigation state (after create/update)
    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccessMessage(location.state.successMessage);
            // Clear the state so it doesn't persist on refresh
            window.history.replaceState({}, document.title);
            
            // Auto dismiss after 5 seconds
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    // Fetch resources from backend
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

    // Load on mount and when filters change
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
            await loadResources(); // Refresh the list after deletion
        } catch (err) {
            setError(err.message || 'Failed to delete resource');
        }
    };

    // Client-side search filter
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
                <div>
                    <h2>Resource Catalogue</h2>
                    <p>Review available campus facilities and assets in real time.</p>
                </div>
                <button type="button" className="btn-secondary" onClick={loadResources} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Filters */}
            <form className="resource-filters card" onSubmit={onApplyFilters}>
                <div className="resource-filter-group">
                    <label htmlFor="resourceSearch">Search</label>
                    <input
                        id="resourceSearch"
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="resource-filter-group">
                    <label htmlFor="typeFilter">Type</label>
                    <select id="typeFilter" name="type" value={filters.type} onChange={handleFilterChange}>
                        {TYPE_OPTIONS.map((t) => (
                            <option key={t || 'ALL'} value={t}>{t || 'ALL'}</option>
                        ))}
                    </select>
                </div>
                <div className="resource-filter-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Loading...' : 'Apply Filters'}
                    </button>
                </div>
            </form>

            {/* Error & Success alerts */}
            {error && <div className="alert alert-error"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{error}</div>}
            {successMessage && <div className="alert alert-success" style={{marginBottom: "18px"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{successMessage}</div>}

            {/* Loading state */}
            {loading && (
                <div className="card resource-empty-state">
                    <p>Loading resources...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredResources.length === 0 && (
                <div className="card resource-empty-state">
                    <h3>No resources found</h3>
                    <p>Try changing filters or add a new resource using the "Add Resource" tab.</p>
                </div>
            )}

            {/* Resource Cards */}
            {!loading && (
                <div className="resource-grid">
                    {filteredResources.map((resource) => (
                        <article className="resource-card" key={resource.id}>
                            {/* Resource Image */}
                            <div className="resource-card-image">
                                <img
                                    src={getResourceImage(resource)}
                                    alt={resource.name}
                                />
                                <span className="resource-type-badge">{resource.type}</span>
                            </div>

                            <div className="resource-card-body">
                                <div className="resource-card-top">
                                    <h3>#{resource.id} {resource.name}</h3>
                                    <span className={statusClass(resource.status)}>
                                        {resource.status}
                                    </span>
                                </div>

                                <div className="resource-meta">
                                    <div><strong>Location:</strong> {resource.location}</div>
                                    <div><strong>Type:</strong> {resource.type}</div>
                                    {resource.type === 'EQUIPMENT' ? (
                                        <div><strong>Quantity:</strong> {resource.quantity > 0 ? resource.quantity : 'N/A'}</div>
                                    ) : (
                                        <div><strong>Capacity:</strong> {resource.capacity > 0 ? `${resource.capacity} People` : 'N/A'}</div>
                                    )}
                                    {resource.availabilityWindow && (
                                        <div><strong>Availability:</strong> {resource.availabilityWindow}</div>
                                    )}
                                </div>

                                <div className="resource-actions">
                                    <button 
                                        type="button" 
                                        className="btn-secondary"
                                        onClick={() => navigate(`/facilities/edit/${resource.id}`)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={() => handleDelete(resource.id)}
                                    >
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