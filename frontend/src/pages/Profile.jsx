import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser, getUserPosts, followUser, unfollowUser, checkFollowStatus, editProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

function Profile() {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    //Editing Profile
    const[editing,setEditing]=useState(false);
    const[editBio,setEditBio]=useState('');
    const[editLoading,setEditLoading]=useState(false);
    const [editAvatar, setEditAvatar] = useState('');


    useEffect(() => {
        setEditing(false);  // Reset edit mode when navigating to a different profile
        Promise.all([
            getUser(id),
            getUserPosts(id, currentUser ? currentUser.id : null)
        ])
        .then(([userData, postsData]) => {
            setUser(userData);
            setPosts(postsData);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [id]);

    // Check if current user is already following this profile
    useEffect(() => {
        if (currentUser && id) {
            checkFollowStatus(id, currentUser.id)
                .then(data => setIsFollowing(data.following))
                .catch(() => {});
        }
    }, [id, currentUser]);

    const handleFollow = async () => {
        if (!currentUser) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(parseInt(id), currentUser.id);
                setIsFollowing(false);
                // Update follower count in real-time
                setUser(prev => ({ ...prev, follower_count: prev.follower_count - 1 }));
            } else {
                await followUser(parseInt(id), currentUser.id);
                setIsFollowing(true);
                // Update follower count in real-time
                setUser(prev => ({ ...prev, follower_count: prev.follower_count + 1 }));
            }
        } catch (err) {
            console.error(err);
        }
        setFollowLoading(false);
    };



    const handleEditProfile=async(e)=>{
        e.preventDefault();
        setEditLoading(true);
        try {
            const updated=await editProfile(currentUser.id,{
                bio:editBio,
                avatar_url: editAvatar
            
            });
            setUser(prev=>({...prev,
                bio:updated.bio,
                avatar_url:updated.avatar_url
            
            
            }));
            setEditing(false);
        } catch (err) {
            console.error(err);
        }
        setEditLoading(false);
    }

    if (loading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!user) return <div className="error">User not found</div>;

    const isOwnProfile = currentUser && currentUser.id === user.id;

    return (
        <div className="page">
            <div className="profile-header">
                <img
                    src={user.avatar_url || 'https://i.pravatar.cc/150'}
                    alt={user.username}
                    className="profile-avatar"
                />
                <h2>{user.username}</h2>
                <p className="bio">{user.bio || 'No bio yet'}</p>
                <div className="profile-stats">
                    <span><strong>{user.post_count}</strong> Posts</span>
                    <span><strong>{user.follower_count}</strong> Followers</span>
                    <span><strong>{user.following_count}</strong> Following</span>
                </div>

                {currentUser && !isOwnProfile && (
                    <button
                        onClick={handleFollow}
                        className={`follow-btn ${isFollowing ? 'following' : ''}`}
                        disabled={followLoading}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}



                {isOwnProfile && !editing && (
                    <button onClick={() => {
                        setEditBio(user.bio || '');
                         setEditAvatar(user.avatar_url || '');
                        setEditing(true);
                    }} className="edit-profile-btn">
                        Edit Profile
                    </button>
                )}

                {/* Edit Profile Form */}

                {editing && (
                    <form onSubmit={handleEditProfile} className='edit-profile-form'>
                        <input
                            type="text"
                            placeholder="Avatar URL"
                            value={editAvatar}
                            onChange={(e) => setEditAvatar(e.target.value)}
                        />
                       
                       
                        <textarea 
                               placeholder="Bio"
                               value={editBio}
                               onChange={(e)=>setEditBio(e.target.value)}
                                rows={3}
                            />
                    <div className='edit-actions'>
                        <button type='submit' disabled={editLoading}>
                            {editLoading ? 'Saving...':'Save'}

                        </button>

                       
                        <button type="button" onClick={() => setEditing(false)} className="cancel-btn">
                Cancel
            </button>
                    </div>
                    </form>
                )}



            </div>
            <h3>Posts by {user.username}</h3>
            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUser ? currentUser.id : 0}
                        onPostDeleted={(postId) => setPosts(posts.filter(p => p.id !== postId))}
                        onPostEdited={(updated) => setPosts(posts.map(p => p.id === updated.id ? { ...updated, liked_by_me: p.liked_by_me, like_count: p.like_count, comment_count: p.comment_count } : p))}
                    />
                ))
            )}
        </div>
    );
}

export default Profile;
