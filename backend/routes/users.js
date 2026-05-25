const express = require('express');
const { getOne, getAll, run } = require('../database/db');

const router = express.Router();

// ⚠️ IMPORTANT: Specific routes MUST come BEFORE /:id routes
// Otherwise Express matches /:id first and never reaches these

// CHECK if following
router.get('/is-following/:profileId/:followerId', (req, res) => {
    try {
        const profileId = parseInt(req.params.profileId);
        const followerId = parseInt(req.params.followerId);

        const follow = getOne(
            'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
            [followerId, profileId]
        );

        res.json({ following: !!follow });

    } catch (error) {
        console.error('Check follow error:', error);
        res.status(500).json({ error: 'Failed to check follow status' });
    }
});

// SEARCH users
router.get('/search', (req, res) => {
    try {
        const query = req.query.q || '';

        const users = getAll(
            'SELECT id, username, avatar_url FROM users WHERE username LIKE ? LIMIT 5',
            [`%${query}%`]
        );

        res.json(users);

    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

// GET user profile
router.get('/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = getOne(
            'SELECT id, username, email, bio, avatar_url, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const postCount = getOne(
            'SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId]
        );
        const followerCount = getOne(
            'SELECT COUNT(*) as count FROM follows WHERE following_id = ?', [userId]
        );
        const followingCount = getOne(
            'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?', [userId]
        );

        res.json({
            ...user,
            post_count: postCount.count,
            follower_count: followerCount.count,
            following_count: followingCount.count
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// FOLLOW a user
router.post('/:id/follow', (req, res) => {
    try {
        const followerId = req.body.userId;
        const followingId = parseInt(req.params.id);

        if (followerId === followingId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const targetUser = getOne('SELECT id FROM users WHERE id = ?', [followingId]);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existing = getOne(
            'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
            [followerId, followingId]
        );

        if (existing) {
            return res.status(400).json({ error: 'Already following' });
        }

        run(
            'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
            [followerId, followingId]
        );

        res.json({ message: 'Following' });

    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ error: 'Failed to follow' });
    }
});

// UNFOLLOW a user
router.delete('/:id/follow', (req, res) => {
    try {
        const followerId = req.body.userId;
        const followingId = parseInt(req.params.id);

        const result = run(
            'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
            [followerId, followingId]
        );

        if (result.changes === 0) {
            return res.status(400).json({ error: 'Not following' });
        }

        res.json({ message: 'Unfollowed' });

    } catch (error) {
        console.error('Unfollow error:', error);
        res.status(500).json({ error: 'Failed to unfollow' });
    }
});


// EDIT profile
router.put('/:id', (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const { userId, bio, avatar_url } = req.body;

        const user = getOne('SELECT id FROM users WHERE id = ?', [profileId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (profileId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        run(
            'UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?',
            [bio || '', avatar_url || '', profileId]
        );

        const updated = getOne(
            'SELECT id, username, email, bio, avatar_url, created_at FROM users WHERE id = ?',
            [profileId]
        );

        res.json(updated);

    } catch (error) {
        console.error('Edit profile error:', error);
        res.status(500).json({ error: 'Failed to edit profile' });
    }
});


module.exports = router;
