import { useEffect, useState, useCallback } from "react";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../../api/ticketApi";
import "./CommentSection.css";

export default function CommentSection({ ticketId, currentUserId = 101 }) {
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
      {error && <div className="comment-error">{error}</div>}

      {/* Comment list */}
      <div className="comment-list">
        {loading && comments.length === 0 && (
          <div className="comment-loading">Loading comments...</div>
        )}

        {!loading && comments.length === 0 && (
          <div className="comment-empty">
            No comments yet. Be the first to comment.
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
                {isOwner ? "You" : `U${c.authorId}`}
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
                        {savingEdit ? "Saving..." : "Save"}
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
                          className="comment-action-btn"
                          onClick={() => handleStartEdit(c)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="comment-action-btn comment-action-delete"
                          onClick={() => handleDelete(c.id)}
                        >
                          🗑️ Delete
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
        >
          {submitting ? (
            <span className="spinner" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
