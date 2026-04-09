import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  getAttachments,
  uploadAttachments,
  deleteAttachment,
  getAttachmentImageUrl,
} from "../../api/ticketApi";
import "./AttachmentSection.css";

const MAX_ATTACHMENTS = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function AttachmentSection({ ticketId, readOnly = false }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const loadAttachments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAttachments(ticketId);
      setAttachments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load attachments");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadAttachments();
  }, [loadAttachments]);

  const validateFiles = (files) => {
    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (files.length > remaining) {
      setError(`You can only add ${remaining} more image(s) (max ${MAX_ATTACHMENTS})`);
      return null;
    }
    const valid = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported image type`);
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB limit`);
        return null;
      }
      valid.push(file);
    }
    return valid;
  };

  const handleUpload = async (fileList) => {
    const files = validateFiles(Array.from(fileList));
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      await uploadAttachments(ticketId, files);
      await loadAttachments();
    } catch (err) {
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (attachmentId, fileName) => {
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    setError("");
    try {
      await deleteAttachment(ticketId, attachmentId);
      await loadAttachments();
    } catch (err) {
      setError(err.message || "Failed to delete");
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canUpload = !readOnly && attachments.length < MAX_ATTACHMENTS;

  return (
    <div className="attachment-section">
      {/* Header */}
      <div className="attachment-header">
        <div className="attachment-header-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span>
            Attachments{" "}
            <span className="attachment-counter">
              {attachments.length}/{MAX_ATTACHMENTS}
            </span>
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="attachment-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Image grid */}
      {attachments.length > 0 && (
        <div className="attachment-grid">
          {attachments.map((att) => (
            <div className="attachment-item" key={att.id}>
              <div
                className="attachment-thumb"
                onClick={() => setPreview(att)}
                title="Click to enlarge"
              >
                <img
                  src={getAttachmentImageUrl(att.filePath)}
                  alt={att.originalFileName}
                  loading="lazy"
                />
              </div>
              <div className="attachment-info">
                <span className="attachment-name" title={att.originalFileName}>
                  {att.originalFileName.length > 30 
                    ? att.originalFileName.substring(0, 27) + "..." 
                    : att.originalFileName}
                </span>
                <span className="attachment-size">
                  {formatSize(att.sizeInBytes)}
                </span>
              </div>
              <button
                type="button"
                className="attachment-delete"
                onClick={() => handleDelete(att.id, att.originalFileName)}
                title="Delete attachment"
                disabled={readOnly}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {readOnly && (
        <div className="attachment-readonly-note">
          Admin view only: upload and delete are disabled.
        </div>
      )}

      {/* Upload area */}
      {canUpload && (
        <div
          className={`attachment-dropzone ${dragOver ? "attachment-dropzone-active" : ""} ${uploading ? "attachment-dropzone-uploading" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            style={{ display: "none" }}
          />
          {uploading ? (
            <div className="dropzone-content">
              <span className="spinner" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="dropzone-content">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div className="dropzone-text">
                <span>Drop images here or <strong>click to browse</strong></span>
                <span className="dropzone-hint">
                  Max {MAX_ATTACHMENTS - attachments.length} image(s) · JPG, PNG, GIF, WebP · Up to 5MB each
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && attachments.length === 0 && (
        <div className="attachment-loading">
          <div className="spinner-small"></div>
          <span>Loading attachments...</span>
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div className="lightbox-overlay" onClick={() => setPreview(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPreview(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img src={getAttachmentImageUrl(preview.filePath)} alt={preview.originalFileName} />
            <div className="lightbox-caption">
              <span>{preview.originalFileName}</span>
              <span>{formatSize(preview.sizeInBytes)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AttachmentSection.propTypes = {
  ticketId: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
};