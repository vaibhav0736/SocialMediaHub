import { useState, useEffect } from 'react';
import { getFollowingPosts, getPosts } from '../api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';


function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab,setTab]=useState('all');

    const { user } = useAuth();   // Get logged-in user

    useEffect(() => {

        setLoading(true);
        const fetchPosts =  tab ==="following" && user ?
                 getFollowingPosts()
                 :getPosts();


       fetchPosts
            .then(setPosts)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [tab, user]);

    if (loading) return <div className="loading">Loading posts...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="feed">
            <h2>Your Feed</h2>


            {/* tab buttons  */}
            <div className="feed-tabs">
                <button
                      className={`tab-btn ${tab === 'all' ? 'active' : ''}`}
                      onClick={()=>setTab('all')}
                      >All Posts</button>

                        <button
                      className={`tab-btn ${tab === 'following' ? 'active' : ''}`}
                      onClick={()=>setTab('following')}
                      >Following</button>

            </div>

        {tab === 'following' && !user && (
                <div className="error">
                    Please <a href="/login">login</a> to see your following feed.
                </div>
            )}



          {posts.length === 0 ? (
                <p className="no-posts">
                    {tab === 'following'
                        ? "No posts from people you follow. Follow some users!"
                        : "No posts yet. Be the first!"}
                </p>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={user ? user.id : 0}
                        onPostDeleted={(postId) => setPosts(posts.filter(p => p.id !== postId))}
                        onPostEdited={(updated) => setPosts(posts.map(p => p.id === updated.id ? { ...updated, liked_by_me: p.liked_by_me, like_count: p.like_count, comment_count: p.comment_count } : p))}
                    />
                ))
            )}
        </div>
    );
}

export default Feed;