import { useEffect, useState, useCallback } from "react";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../../api/ticketApi";
import "./CommentSection.css";

export default function CommentSection({ ticketId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getComments(ticketId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await addComment(ticketId, newComment.trim(), currentUserId);
      setNewComment("");
      await loadComments();
    } catch (err) {
      setError(err.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Save edit
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    setSavingEdit(true);
    setError("");
    try {
      await updateComment(
        ticketId,
        commentId,
        editContent.trim(),
        currentUserId
      );
      setEditingId(null);
      setEditContent("");
      await loadComments();
    } catch (err) {
      setError(err.message || "Failed to update comment");
    } finally {
      setSavingEdit(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    setError("");
    try {
      await deleteComment(ticketId, commentId, currentUserId);
      await loadComments();
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="comment-section">
      {/* Header */}
      <div className="comment-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>
          Comments{" "}
          {comments.length > 0 && (
            <span className="comment-count">{comments.length}</span>
          )}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="comment-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Comment list */}
      <div className="comment-list">
        {loading && comments.length === 0 && (
          <div className="comment-loading">
            <div className="spinner-small"></div>
            <span>Loading comments...</span>
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="comment-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No comments yet. Be the first to comment.</p>
          </div>
        )}

        {comments.map((c) => {
          const isOwner = c.authorId === currentUserId;
          const isEditing = editingId === c.id;
          const wasEdited =
            c.updatedAt && c.createdAt && c.updatedAt !== c.createdAt;

          return (
            <div className="comment-item" key={c.id}>
              {/* Avatar */}
              <div className="comment-avatar">
                {isOwner ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>

              {/* Body */}
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">
                    {isOwner ? "You" : `User ${c.authorId}`}
                  </span>
                  <span className="comment-time">
                    {formatTime(c.createdAt)}
                    {wasEdited && (
                      <span className="comment-edited"> (edited)</span>
                    )}
                  </span>
                </div>

                {isEditing ? (
                  /* Edit mode */
                  <div className="comment-edit">
                    <textarea
                      className="comment-edit-input"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      autoFocus
                    />
                    <div className="comment-edit-actions">
                      <button
                        type="button"
                        className="comment-btn comment-btn-save"
                        onClick={() => handleSaveEdit(c.id)}
                        disabled={savingEdit || !editContent.trim()}
                      >
                        {savingEdit ? (
                          <span className="spinner-small"></span>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="comment-btn comment-btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={savingEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <p className="comment-text">{c.content}</p>
                    {isOwner && (
                      <div className="comment-actions">
                        <button
                          type="button"
                          className="comment-action-btn edit"
                          onClick={() => handleStartEdit(c)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                            <path d="M4 20h16" />
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="comment-action-btn delete"
                          onClick={() => handleDelete(c.id)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                            <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add comment form */}
      <form className="comment-form" onSubmit={handleAddComment}>
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
        />
        <button
          type="submit"
          className="comment-submit"
          disabled={submitting || !newComment.trim()}
          title="Send comment"
          aria-label="Send comment"
        >
          {submitting ? (
            <span className="spinner-small" />
          ) : (
            <svg className="comment-submit-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}