const BASE_URL = 'http://localhost:3000/api';

// Helper - handles JSON parsing and errors
async function request(url, options = {}) {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: { 'Content-Type': 'application/json' },
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
export const getPosts = (userId) => {
    const params = userId ? `?userId=${userId}` : '';
    return request(`/posts${params}`);
};

export const getFollowingPosts = (userId) => request(`/posts/following/${userId}`);


export const getPost = (id) => request(`/posts/${id}`);

export const createPost = (postData) =>
    request('/posts', { method: 'POST', body: JSON.stringify(postData) });

export const likePost = (postId, userId) =>
    request(`/posts/${postId}/like`, { method: 'POST', body: JSON.stringify({ userId }) });

export const unlikePost = (postId, userId) =>
    request(`/posts/${postId}/like`, { method: 'DELETE', body: JSON.stringify({ userId }) });

export const commentOnPost = (postId, userId, content) =>
    request(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ userId, content }) });

export const getUserPosts = (userId, currentUserId) => {
    const params = currentUserId ? `?currentUserId=${currentUserId}` : '';
    return request(`/posts/user/${userId}${params}`);
};

export const editPost = (postId, userId, content) =>
    request(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ userId, content }) });

export const deletePost = (postId, userId) =>
    request(`/posts/${postId}`, { method: 'DELETE', body: JSON.stringify({ userId }) });




// Users
export const getUser = (id) => request(`/users/${id}`);

export const followUser = (targetId, myId) =>
    request(`/users/${targetId}/follow`, { method: 'POST', body: JSON.stringify({ userId: myId }) });

export const unfollowUser = (targetId, myId) =>
    request(`/users/${targetId}/follow`, { method: 'DELETE', body: JSON.stringify({ userId: myId }) });

export const checkFollowStatus = (profileId, myId) =>
    request(`/users/is-following/${profileId}/${myId}`);


export const searchUsers = (query) => request(`/users/search?q=${encodeURIComponent(query)}`);







//profile
export const editProfile = (userId, data) =>
    request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify({ userId, ...data }) });
