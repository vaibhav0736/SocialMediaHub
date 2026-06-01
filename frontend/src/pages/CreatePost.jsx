import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);        // the selected File object
    const [preview, setPreview] = useState(null);     // data URL for preview
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fileInputRef = useRef(null);   // to reset the file input
    const { user } = useAuth();
    const navigate = useNavigate();

    // Show a preview when user selects an image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // FileReader converts the file to a data URL for <img> preview
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) {
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
            // Build FormData — can't use JSON because of the file
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);   // 'image' matches upload.single('image')
            }

            await createPost(formData);
            setContent('');
            setImage(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
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
                    />

                    {/* File input — hidden, triggered by button */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={() => fileInputRef.current.click()}>
                        {image ? 'Change Image' : 'Add Image'}
                    </button>

                    {/* Show preview of selected image */}
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ width: '100%', borderRadius: 8, marginTop: 8 }}
                        />
                    )}

                    {image && (
                        <button type="button" className="cancel-btn" onClick={() => {
                            setImage(null);
                            setPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}>
                            Remove Image
                        </button>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post It!'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreatePost;
