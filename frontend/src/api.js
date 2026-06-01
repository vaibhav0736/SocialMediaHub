const BASE_URL = 'http://localhost:3000/api';

// Helper - handles JSON parsing and errors
async function request(url, options = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }
    return data;
}

// Auth
export const register = (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });

export const login = (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });





// Posts
export const getPosts = () => request('/posts');

export const getFollowingPosts = () => request('/posts/following');


export const getPost = (id) => request(`/posts/${id}`);

export const createPost = (formData) =>{
    const token=localStorage.getItem('token'); 
    return request('/posts', { 
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
};

export const likePost = (postId) =>
    request(`/posts/${postId}/like`, { method: 'POST' });

export const unlikePost = (postId) =>
    request(`/posts/${postId}/like`, { method: 'DELETE' });

export const commentOnPost = (postId, content) =>
    request(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ content }) });

export const getUserPosts = (userId) => request(`/posts/user/${userId}`);

export const editPost = (postId, content) =>
    request(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ content }) });

export const deletePost = (postId) =>
    request(`/posts/${postId}`, { method: 'DELETE' });




// Users
export const getUser = (id) => request(`/users/${id}`);

export const followUser = (targetId) =>
    request(`/users/${targetId}/follow`, { method: 'POST' });

export const unfollowUser = (targetId) =>
    request(`/users/${targetId}/follow`, { method: 'DELETE' });

export const checkFollowStatus = (profileId) =>
    request(`/users/is-following/${profileId}`);


export const searchUsers = (query) => request(`/users/search?q=${encodeURIComponent(query)}`);




// Notifications
export const getNotifications = () => request('/notifications');

export const getUnreadCount = () => request('/notifications/unread-count');

export const markNotificationRead = (id) =>
    request(`/notifications/${id}/read`, { method: 'PUT' });

export const markAllRead = () =>
    request('/notifications/read-all', { method: 'PUT' });



// Change Password
export const changePassword = (oldPassword, newPassword) =>
    request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
    });

//profile
export const editProfile = (userId, data) =>
    request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) });
