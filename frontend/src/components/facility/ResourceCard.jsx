import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResourceList.css';

// Import Assets
import roomImg from '../../assets/room.png';
import confRoomImg from '../../assets/conference_room.png';
import lectRoomImg from '../../assets/lecture_hall.png';
import studyRoomImg from '../../assets/study_room.png';

import labImg from '../../assets/lab.png';
import chemLabImg from '../../assets/chemistry_lab.png';
import compLabImg from '../../assets/computer_lab.png';
import dataLabImg from '../../assets/data_science_lab.png';
import netLabImg from '../../assets/network_lab.png';

import equipImg from '../../assets/equipment.png';
import projImg from '../../assets/projector.png';
import dslrImg from '../../assets/dslr_camera.png';
import paImg from '../../assets/pa_system.png';
import macImg from '../../assets/mac_workstation.png';

function statusClass(status) {
  return `badge badge-${String(status || '').toLowerCase().replaceAll('_', '-')}`;
}

const getImageForResource = (type, name) => {
  const n = (name || '').toLowerCase();
  
  if (type === 'ROOM') {
    if (n.includes('conference')) return confRoomImg;
    if (n.includes('lecture')) return lectRoomImg;
    if (n.includes('study')) return studyRoomImg;
    return roomImg;
  }
  
  if (type === 'LAB') {
    if (n.includes('chemistry')) return chemLabImg;
    if (n.includes('computer')) return compLabImg;
    if (n.includes('data')) return dataLabImg;
    if (n.includes('network')) return netLabImg;
    return labImg;
  }
  
  if (type === 'EQUIPMENT') {
    if (n.includes('projector')) return projImg;
    if (n.includes('camera') || n.includes('dslr')) return dslrImg;
    if (n.includes('pa') || n.includes('audio')) return paImg;
    if (n.includes('mac') || n.includes('apple')) return macImg;
    return equipImg;
  }
  
  return roomImg;
};

const ResourceCard = ({ resource, isAdmin = false, onDelete }) => {
    const navigate = useNavigate();

    return (
        <article className="resource-card">
            {/* Resource Image */}
            <div className="resource-card-icon">
                <img src={getImageForResource(resource.type, resource.name)} alt={resource.name} />
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

                {isAdmin && (
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
                            onClick={() => onDelete(resource.id)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                                <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                            </svg>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
};

export default ResourceCard;
