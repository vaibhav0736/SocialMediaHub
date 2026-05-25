--Drop tables if exist (for clean re-creation)
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;


-- USERS TABLE(core tabel every other table relates to this)

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);


-- POSTS TABLE
CREATE TABLE POSTS (
     id INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for fetching posts by a specific user (profile page)
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Index for chronological feed (newest first)
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);


-- COMMENTS TABLE
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Index for fetching comments on a specific post
CREATE INDEX idx_comments_post_id ON comments(post_id);



-- =============================================
-- LIKES TABLE (Many-to-Many relationship)
-- =============================================
-- USER <--LIKES--> POST
-- This is a JUNCTION/BRIDGE table connecting two tables

CREATE TABLE likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(user_id,post_id)
);


-- Composite index for checking if user already liked a post
CREATE INDEX idx_likes_user_post ON likes(user_id, post_id);

-- Index for counting likes on a post
CREATE INDEX idx_likes_post_id ON likes(post_id);


-- =============================================
-- FOLLOWS TABLE (Self-referential Many-to-Many)
-- =============================================
-- USER <--FOLLOWS--> USER
-- This connects users to other users



CREATE TABLE follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(follower_id,following_id)

);


-- Index for finding who a user is following
CREATE INDEX idx_follows_follower ON follows(follower_id);

-- Index for finding who follows a user
CREATE INDEX idx_follows_following ON follows(following_id);