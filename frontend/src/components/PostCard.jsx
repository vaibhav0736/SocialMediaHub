import { useState } from 'react';
import { Link } from 'react-router-dom';
import { likePost, unlikePost, commentOnPost, editPost, deletePost } from '../api';

function PostCard({ post, currentUserId, onPostDeleted, onPostEdited }) {
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [liked, setLiked] = useState(post.liked_by_me || false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit state
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editLoading, setEditLoading] = useState(false);

    // Delete state
    const [deleting, setDeleting] = useState(false);

    const isOwner = currentUserId === post.user_id;

    const handleLike = async () => {
        if (liked) {
            await unlikePost(post.id, currentUserId);
            setLikeCount(likeCount - 1);
            setLiked(false);
        } else {
            await likePost(post.id, currentUserId);
            setLikeCount(likeCount + 1);
            setLiked(true);
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            const res = await fetch(`http://localhost:3000/api/posts/${post.id}`);
            const data = await res.json();
            setComments(data.comments || []);
        }
        setShowComments(!showComments);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const newComment = await commentOnPost(post.id, currentUserId, commentText);
            setComments([...comments, newComment]);
            setCommentText('');
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;
        setEditLoading(true);
        try {
            const updated = await editPost(post.id, currentUserId, editContent);
            if (onPostEdited) onPostEdited(updated);
            setEditing(false);
        } catch (err) {
            console.error(err);
        }
        setEditLoading(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return;
        setDeleting(true);
        try {
            await deletePost(post.id, currentUserId);
            if (onPostDeleted) onPostDeleted(post.id);
        } catch (err) {
            console.error(err);
        }
        setDeleting(false);
    };

    return (
        <div className="post-card">
            <div className="post-header">
                {post.avatar_url ? (
                    <img src={post.avatar_url} alt={post.username} className="avatar" />
                ) : (
                    <div className="avatar avatar-placeholder">{post.username[0].toUpperCase()}</div>
                )}
                <Link to={`/users/${post.user_id}`} className="username-link">
                    <strong>{post.username}</strong>
                </Link>
                <span className="timestamp">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {editing ? (
                <form onSubmit={handleEdit} className="edit-form">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        required
                    />
                    <div className="edit-actions">
                        <button type="submit" disabled={editLoading}>
                            {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <p className="post-content">{post.content}</p>
                    {post.image_url && (
                        <img
                            src={post.image_url.startsWith('/uploads/')
                                ? `http://localhost:3000${post.image_url}`
                                : post.image_url}
                            alt="Post"
                            className="post-image"
                        />
                    )}
                </>
            )}

            <div className="post-actions">
                <button onClick={handleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
                    {liked ? '❤️' : '🤍'} {likeCount} Likes
                </button>
                <button onClick={toggleComments}>
                    💬 {comments.length || post.comment_count} Comments
                </button>

                {isOwner && !editing && (
                    <div className="owner-actions">
                        <button onClick={() => setEditing(true)} className="edit-btn">Edit</button>
                        <button onClick={handleDelete} disabled={deleting} className="delete-btn">
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {showComments && (
                <div className="comments-section">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <strong>{comment.username}</strong>: {comment.content}
                        </div>
                    ))}
                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            disabled={submitting}
                        />
                        <button type="submit" disabled={submitting}>Post</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PostCard;
