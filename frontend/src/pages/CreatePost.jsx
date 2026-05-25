import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { user } = useAuth();        // Get logged-in user from context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Post cannot be empty');
            return;
        }
        if (!user) {
            setError('You must be logged in to post');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await createPost({ userId: user.id, content, imageUrl: '' });  // ← real userId
            setContent('');
            setSuccess('Post created successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="page">
            <h2>Create Post</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            {!user ? (
                <div className="error">Please <a href="/login">login</a> to create a post.</div>
            ) : (
                <form onSubmit={handleSubmit} className="auth-form">
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post It!'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreatePost;
