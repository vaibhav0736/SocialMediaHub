-- =============================================
-- SAMPLE DATA - Makes the app feel alive
-- =============================================

-- Insert sample users (password is 'password123' hashed with bcrypt)
-- Hash explanation: 'password123' → '$2a$10$...' (can't be reversed)
INSERT INTO users (username, email, password, bio, avatar_url) VALUES
('alice', 'alice@example.com', '$2b$10$0MbOgDv71SEL9EyEY7A8Eu06k5hhejvZTaIL2oeSLuGW/V09jsur2', 'Tech enthusiast & coffee lover', 'https://i.pravatar.cc/150?u=alice'),
('bob', 'bob@example.com', '$2b$10$0MbOgDv71SEL9EyEY7A8Eu06k5hhejvZTaIL2oeSLuGW/V09jsur2', 'Software engineer at heart', 'https://i.pravatar.cc/150?u=bob'),
('charlie', 'charlie@example.com', '$2b$10$0MbOgDv71SEL9EyEY7A8Eu06k5hhejvZTaIL2oeSLuGW/V09jsur2', 'Design is my passion', 'https://i.pravatar.cc/150?u=charlie'),
('diana', 'diana@example.com', '$2b$10$0MbOgDv71SEL9EyEY7A8Eu06k5hhejvZTaIL2oeSLuGW/V09jsur2', 'Lifelong learner', 'https://i.pravatar.cc/150?u=diana');

-- Insert sample posts
INSERT INTO posts (user_id, content, image_url, created_at) VALUES
(1, 'Just built my first React app! So excited to learn more. #coding #react', '', datetime('now', '-2 hours')),
(2, 'Coffee + Code = Perfect morning', '', datetime('now', '-5 hours')),
(1, 'Database design is actually pretty cool once you understand the relationships.', '', datetime('now', '-1 day')),
(3, 'Design tip: White space is not empty space. It gives your content room to breathe.', '', datetime('now', '-1 day', '-3 hours')),
(4, 'Starting my full-stack journey today! Any tips for beginners?', '', datetime('now', '-2 days')),
(2, 'Just learned about SQL JOINs. INNER, LEFT, RIGHT - they all have their place!', '', datetime('now', '-3 days')),
(3, 'Working on a new design system. Will share soon!', '', datetime('now', '-4 days')),
(1, 'Pro tip: Always draw your database schema on paper before writing code.', '', datetime('now', '-5 days'));

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content, created_at) VALUES
(1, 2, 'Congrats! React is awesome once you get the hang of hooks.', datetime('now', '-1 hour')),
(1, 3, 'Welcome to the club! Let me know if you need help.', datetime('now', '-30 minutes')),
(4, 1, 'Great advice! White space transformed my designs.', datetime('now', '-20 hours')),
(5, 2, 'My tip: Build projects, not tutorials. You learn 10x faster!', datetime('now', '-1 day')),
(5, 4, 'Thank you! That''s exactly what I needed to hear.', datetime('now', '-12 hours'));

-- Insert sample likes
INSERT INTO likes (user_id, post_id, created_at) VALUES
(2, 1, datetime('now', '-1 hour')),
(3, 1, datetime('now', '-30 minutes')),
(4, 1, datetime('now', '-15 minutes')),
(1, 2, datetime('now', '-4 hours')),
(3, 2, datetime('now', '-3 hours')),
(4, 3, datetime('now', '-20 hours')),
(2, 4, datetime('now', '-1 day')),
(1, 4, datetime('now', '-18 hours')),
(4, 5, datetime('now', '-2 days')),
(1, 7, datetime('now', '-3 days'));

-- Insert sample follows
INSERT INTO follows (follower_id, following_id, created_at) VALUES
(2, 1, datetime('now', '-10 days')),  -- Bob follows Alice
(3, 1, datetime('now', '-8 days')),   -- Charlie follows Alice
(4, 1, datetime('now', '-5 days')),  -- Diana follows Alice
(1, 2, datetime('now', '-7 days')),   -- Alice follows Bob
(3, 2, datetime('now', '-6 days')),   -- Charlie follows Bob
(4, 2, datetime('now', '-4 days')),  -- Diana follows Bob
(1, 3, datetime('now', '-5 days')),   -- Alice follows Charlie
(2, 3, datetime('now', '-3 days')),  -- Bob follows Charlie
(4, 3, datetime('now', '-2 days')),  -- Diana follows Charlie
(1, 4, datetime('now', '-1 day'));    -- Alice follows Diana
