const express = require('express');
const { getOne, getAll, run } = require('../database/db');
const router = express.Router();
const multer=require('multer');
const path=require('path');

// Where to save files + how to name them
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');   // save in backend/uploads/
    },
    filename: (req, file, cb) => {
        // Give each file a unique name: timestamp-random.ext
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);  // e.g. ".png"
        cb(null, uniqueName + ext);
    }
});

// Only allow image files (reject PDFs, videos, etc.)
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// GET all posts (Feed)
router.get('/', (req, res) => {
    try {
        const userId = req.user.userId ? parseInt(req.user.userId) : null;

        const posts = getAll(`
            SELECT
                posts.id,
                posts.content,
                posts.image_url,
                posts.created_at,
                users.id as user_id,
                users.username,
                users.avatar_url,
                (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count,
                COALESCE((SELECT 1 FROM likes WHERE post_id = posts.id AND user_id = ?), 0) as liked_by_me
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `, [userId || 0]);

        const result = posts.map(p => ({ ...p, liked_by_me: !!p.liked_by_me }));
        res.json(result);

    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// GET posts by a user you follow
router.get('/following', (req, res) => {
    try {
        const userId = req.user.userId;

        const posts = getAll(`
            SELECT
                posts.id, posts.content, posts.image_url, posts.created_at,
                users.id as user_id, users.username, users.avatar_url,
                (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count,
                COALESCE((SELECT 1 FROM likes WHERE post_id = posts.id AND user_id = ?), 0) as liked_by_me
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            WHERE posts.user_id IN (
                SELECT following_id FROM follows WHERE follower_id = ?
            )
            ORDER BY posts.created_at DESC
        `, [userId, userId]);

        const result = posts.map(p => ({ ...p, liked_by_me: !!p.liked_by_me }));
        res.json(result);

    } catch (error) {
        console.error('Get Following posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// GET single post with comments
router.get('/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        const post = getOne(`
            SELECT
                posts.id, posts.content, posts.image_url, posts.created_at,
                users.id as user_id, users.username, users.avatar_url,
                (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [postId]);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comments = getAll(`
            SELECT
                comments.id, comments.content, comments.created_at,
                users.id as user_id, users.username, users.avatar_url
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at ASC
        `, [postId]);

        res.json({ ...post, comments });

    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Failed to get post' });
    }
});

// CREATE a post (with optional image upload)
router.post('/', upload.single('image'), (req, res) => {
    try {
        const userId = req.user.userId;
        const { content } = req.body;

        if (!content && !req.file) {
            return res.status(400).json({ error: 'Post must have content or an image' });
        }

        // Build the image URL if a file was uploaded
        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`   // relative URL, served by Express
            : '';

        const result = run(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [parseInt(userId), content || '', imageUrl]
        );

        const newPost = getOne(`
            SELECT posts.*, users.username, users.avatar_url
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [result.lastInsertRowid]);

        res.status(201).json(newPost);

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// LIKE a post
router.post('/:id/like', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.userId;

        const post = getOne('SELECT id FROM posts WHERE id = ?', [postId]);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existing = getOne(
            'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );

        if (existing) {
            return res.status(400).json({ error: 'Already liked' });
        }




        run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);

          //-Notification
          //who owns this post ? we need to notfify them,not thr liker
          const postOwner=getOne('SELECT user_id FROM posts WHERE id=?',[postId])

          //Only notify if liker is not not the post owner(dont notify yourself)


          if(postOwner && postOwner.user_id !== userId) {
            //get the liker username for the message

            const actor=getOne('SELECT username FROM users WHERE ID=?',[userId]);

            run(
                'INSERT INTO notifications (user_id,actor_id,type,post_id,message) VALUES (?,?,?,?,?)',
                [postOwner.user_id, userId, 'like', postId, `${actor.username} liked your post`]
            );
        }


        const count = getOne('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);

        res.json({ message: 'Liked', like_count: count.count });

    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// UNLIKE a post
router.delete('/:id/like', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.userId;

        const result = run(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );

        if (result.changes === 0) {
            return res.status(400).json({ error: 'Not liked' });
        }

        const count = getOne('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);

        res.json({ message: 'Unliked', like_count: count.count });

    } catch (error) {
        console.error('Unlike error:', error);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});

// DELETE a post
router.delete('/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.userId;

        const post = getOne('SELECT * FROM posts WHERE id = ?', [postId]);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        run('DELETE FROM posts WHERE id = ?', [postId]);

        res.json({ message: 'Post deleted' });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// COMMENT on a post
router.post('/:id/comment', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.userId;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        const post = getOne('SELECT id FROM posts WHERE id = ?', [postId]);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const result = run(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, userId, content]
        );

        const newComment = getOne(`
            SELECT comments.*, users.username, users.avatar_url
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.id = ?
        `, [result.lastInsertRowid]);


        const postOwner=getOne('SELECT user_id FROM posts WHERE id=?',[postId]);

        if(postOwner && postOwner.user_id!==userId)
        {
            const actor=getOne('SELECT username FROM users WHERE id=?',[userId]);
            run(
                'INSERT INTO notifications (user_id,actor_id,type,post_id,message) VALUES (?,?,?,?,?)',
                [postOwner.user_id, userId, 'comment', postId, `${actor.username} commented on your post`]
            );
        }
        res.status(201).json(newComment);

    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// GET posts by a specific user
router.get('/user/:userId', (req, res) => {
    try {
        const profileUserId = parseInt(req.params.userId);
        const currentUserId = req.user.userId ? parseInt(req.user.userId) : null;

        const posts = getAll(`
            SELECT
                posts.id, posts.content, posts.image_url, posts.created_at,
                users.id as user_id, users.username, users.avatar_url,
                (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count,
                COALESCE((SELECT 1 FROM likes WHERE post_id = posts.id AND user_id = ?), 0) as liked_by_me
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            WHERE posts.user_id = ?
            ORDER BY posts.created_at DESC
        `, [currentUserId || 0, profileUserId]);

        const result = posts.map(p => ({ ...p, liked_by_me: !!p.liked_by_me }));
        res.json(result);

    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// EDIT a post
router.put('/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user.userId;
        const { content } = req.body;

        const post = getOne('SELECT * FROM posts WHERE id = ?', [postId]);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        run('UPDATE posts SET content = ? WHERE id = ?', [content, postId]);

        const updated = getOne(`
            SELECT posts.*, users.username, users.avatar_url
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [postId]);

        res.json(updated);

    } catch (error) {
        console.error('Edit post error:', error);
        res.status(500).json({ error: 'Failed to edit post' });
    }
});






module.exports = router;
