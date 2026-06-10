import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, likePost, unlikePost, commentOnPost } from '../api';
import { useAuth } from '../context/AuthContext';

function PostDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPost(id)
            .then(data => {
                setPost(data);
                setLikeCount(data.like_count || 0);
                setLiked(!!data.liked_by_me);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleLike = async () => {
        try {
            if (liked) {
                await unlikePost(post.id);
                setLikeCount(prev => prev - 1);
                setLiked(false);
            } else {
                await likePost(post.id);
                setLikeCount(prev => prev + 1);
                setLiked(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const newComment = await commentOnPost(post.id, commentText);
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, newComment],
                comment_count: prev.comment_count + 1
            }));
            setCommentText('');
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="loading">Loading post...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!post) return <div className="error">Post not found</div>;

    return (
        <div className="page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="post-detail">
                {/* Author */}
                <div className="post-header">
                    {post.avatar_url ? (
                        <img src={post.avatar_url} alt={post.username} className="avatar" />
                    ) : (
                        <div className="avatar avatar-placeholder">{post.username[0].toUpperCase()}</div>
                    )}
                    <Link to={`/users/${post.user_id}`}><strong>{post.username}</strong></Link>
                    <span className="timestamp">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                {/* Content */}
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

                {/* Like + Comment count */}
                <div className="post-actions">
                    <button onClick={handleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
                        {liked ? '❤️' : '🤍'} {likeCount} Likes
                    </button>
                    <span>💬 {post.comments ? post.comments.length : post.comment_count} Comments</span>
                </div>

                {/* Comments */}
                <div className="comments-section">
                    <h3>Comments</h3>
                    {post.comments && post.comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <Link to={`/users/${comment.user_id}`}><strong>{comment.username}</strong></Link>
                            <span className="timestamp">{new Date(comment.created_at).toLocaleDateString()}</span>
                            <p>{comment.content}</p>
                        </div>
                    ))}

                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={submitting}
                        />
                        <button type="submit" disabled={submitting}>Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
