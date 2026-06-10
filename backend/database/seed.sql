-- =============================================
-- SAMPLE DATA - 10 Users with Posts & Interactions
-- Password for all users: password123
-- =============================================

INSERT INTO users (username, email, password, bio, avatar_url) VALUES
('aarav_sharma', 'aarav@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Photographer | Capturing moments one click at a time', 'https://i.pravatar.cc/150?u=aarav'),
('priya_patel', 'priya@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Food blogger | Home chef | Recipe developer', 'https://i.pravatar.cc/150?u=priya'),
('rahul_fit', 'rahul@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Fitness trainer | Helping you become your best self', 'https://i.pravatar.cc/150?u=rahul'),
('neha_reads', 'neha@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Book lover | Writing my first novel | Tea addict', 'https://i.pravatar.cc/150?u=neha'),
('vikram_wanderer', 'vikram@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Travel enthusiast | 15 countries and counting', 'https://i.pravatar.cc/150?u=vikram'),
('ananya_music', 'ananya@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Musician | Guitarist | Songwriter', 'https://i.pravatar.cc/150?u=ananya'),
('karan_tech', 'karan@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Tech entrepreneur | Building the next big thing', 'https://i.pravatar.cc/150?u=karan'),
('sneha_art', 'sneha@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Artist & Illustrator | DM for commissions', 'https://i.pravatar.cc/150?u=sneha'),
('rohit_gamer', 'rohit@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Gamer | Streaming on weekends | Valorant addict', 'https://i.pravatar.cc/150?u=rohit'),
('ishita_earth', 'ishita@example.com', '$2b$10$gSbiQFHu.ihHR6vUURiITuODsABinpMUWQ6MVbPA/5Wy3EJg3IzMi', 'Environmental activist | Planted 500+ trees', 'https://i.pravatar.cc/150?u=ishita');

-- =============================================
-- POSTS (2-3 per user, ~25 total)
-- =============================================
INSERT INTO posts (user_id, content, image_url, created_at) VALUES
-- Aarav's posts (user 1)
(1, 'Golden hour at the beach today. Nature really is the best artist!', '', datetime('now', '-2 hours')),
(1, 'New lens arrived! Can''t wait to test it out this weekend. Any suggestions for locations?', '', datetime('now', '-1 day')),
(1, 'Behind every great photo is a photographer who woke up at 4 AM for perfect lighting.', '', datetime('now', '-3 days')),

-- Priya's posts (user 2)
(2, 'Just perfected my butter chicken recipe after 12 attempts. The secret is in the kasuri methi!', '', datetime('now', '-5 hours')),
(2, 'Food is not just fuel. It''s memory, it''s culture, it''s love on a plate.', '', datetime('now', '-2 days')),
(2, 'Street food tour in Delhi today. Chaat, chole bhature, and jalebi. My heart (and stomach) is full!', '', datetime('now', '-4 days')),

-- Rahul's posts (user 3)
(3, 'Day 1 vs Day 90 transformation. Consistency beats motivation every single time.', '', datetime('now', '-3 hours')),
(3, 'Remember: You don''t have to be extreme, just consistent. 30 mins a day is better than 3 hours once a week.', '', datetime('now', '-2 days')),

-- Neha's posts (user 4)
(4, 'Just finished reading "Project Hail Mary" by Andy Weir. Absolutely mind-blowing sci-fi!', '', datetime('now', '-6 hours')),
(4, 'Wrote 2000 words today. The novel is taking shape. It''s about a librarian who discovers a hidden world inside books.', '', datetime('now', '-1 day')),
(4, 'A room without books is like a body without a soul. My personal library is my happy place.', '', datetime('now', '-5 days')),

-- Vikram's posts (user 5)
(5, 'Just got back from Spiti Valley. The landscapes there don''t feel real. India is incredible!', '', datetime('now', '-1 day')),
(5, 'Travel tip: Always carry a power bank, a scarf (multi-purpose!), and an open mind.', '', datetime('now', '-3 days')),

-- Ananya's posts (user 6)
(6, 'New original song dropping this Friday! It''s called "Midnight Trains" and it''s very close to my heart.', '', datetime('now', '-4 hours')),
(6, 'Practiced for 4 hours today. My fingers are sore but my soul is happy.', '', datetime('now', '-2 days')),

-- Karan's posts (user 7)
(7, 'Just closed our seed round! Proud of what the team has built. The real work starts now.', '', datetime('now', '-7 hours')),
(7, 'The best startups solve problems the founders themselves face. Scratch your own itch.', '', datetime('now', '-2 days')),
(7, 'Hiring developers! If you''re passionate about AI and education, DM me.', '', datetime('now', '-4 days')),

-- Sneha's posts (user 8)
(8, 'New digital painting. Titled "Eclipse of the Heart". What do you think?', '', datetime('now', '-1 day')),
(8, 'Art block is real. Here''s what helps me: take a walk, look at clouds, drink water, start scribbling.', '', datetime('now', '-3 days')),

-- Rohit's posts (user 9)
(9, 'Finally hit Diamond rank in Valorant! 6 months of grinding paid off.', '', datetime('now', '-8 hours')),
(9, 'Streaming tonight at 8 PM IST. Come watch me fail spectacularly at horror games!', '', datetime('now', '-1 day')),

-- Ishita's posts (user 10)
(10, 'Planted 50 trees today with the community. Our planet needs us more than ever.', '', datetime('now', '-5 hours')),
(10, 'Small changes matter: carry a reusable bag, say no to single-use plastic, compost your waste.', '', datetime('now', '-2 days')),
(10, 'Climate change is not a future problem. It''s happening right now. Educate yourself, take action.', '', datetime('now', '-4 days'));

-- =============================================
-- COMMENTS (cross-interactions between users)
-- =============================================
INSERT INTO comments (post_id, user_id, content, created_at) VALUES
-- Comments on Aarav's posts
(1, 2, 'Stunning shot! Where was this taken?', datetime('now', '-1 hour')),
(1, 5, 'I need to visit this place. Adding to my travel list!', datetime('now', '-30 minutes')),
(2, 8, 'Try the old city area at dawn. The light is magical there.', datetime('now', '-12 hours')),

-- Comments on Priya's posts
(4, 10, 'Love that you mentioned kasuri methi! It really makes a difference.', datetime('now', '-3 hours')),
(4, 5, 'Can you share the full recipe? I want to try making this!', datetime('now', '-2 hours')),

-- Comments on Rahul's posts
(7, 4, 'This is so inspiring! Just started my fitness journey last week.', datetime('now', '-2 hours')),
(7, 9, 'What workout split do you recommend for beginners?', datetime('now', '-1 hour')),
(8, 1, 'Totally agree. Small daily habits compound into massive results.', datetime('now', '-1 day')),

-- Comments on Neha's posts
(9, 6, 'Loved that book too! The ending had me in tears.', datetime('now', '-3 hours')),
(10, 7, 'Such a unique concept. A librarian discovering hidden worlds - would love to read it!', datetime('now', '-10 hours')),
(11, 8, 'My TBR pile is out of control but I keep buying more. No regrets!', datetime('now', '-3 days')),

-- Comments on Vikram's posts
(12, 1, 'Spiti is on my bucket list! What camera do you use for travel?', datetime('now', '-10 hours')),
(13, 3, 'Good tips. Also add: learn a few local phrases. It goes a long way!', datetime('now', '-2 days')),

-- Comments on Ananya's posts
(14, 8, 'Can''t wait for Friday! Your last song "Rainy Days" is still on repeat.', datetime('now', '-2 hours')),
(15, 6, 'The dedication shows. Your music keeps getting better!', datetime('now', '-1 day')),

-- Comments on Karan's posts
(16, 7, 'Congratulations! That is huge. What''s the startup about?', datetime('now', '-5 hours')),
(18, 3, 'What tech stack are you using? I know some devs who might be interested.', datetime('now', '-3 days')),

-- Comments on Sneha's posts
(19, 4, 'The color palette on this one is stunning. Your style is so recognizable.', datetime('now', '-8 hours')),
(20, 6, 'Cloud watching is underrated. It clears the mind like nothing else.', datetime('now', '-2 days')),

-- Comments on Ishita's posts
(25, 2, 'Thank you for doing this! I joined a local cleanup group because of your posts.', datetime('now', '-3 hours')),
(24, 5, 'The more I travel, the more I see the damage. We all need to do our part.', datetime('now', '-2 days'));

-- =============================================
-- LIKES (spread across posts, multiple likes per popular post)
-- =============================================
INSERT INTO likes (user_id, post_id, created_at) VALUES
-- Post 1 (Aarav beach photo) - popular
(2, 1, datetime('now', '-1 hour')), (3, 1, datetime('now', '-45 min')), (5, 1, datetime('now', '-20 min')),
(8, 1, datetime('now', '-10 min')), (10, 1, datetime('now', '-5 min')),
-- Post 4 (Priya recipe)
(1, 4, datetime('now', '-4 hours')), (5, 4, datetime('now', '-3 hours')), (10, 4, datetime('now', '-2 hours')),
-- Post 7 (Rahul transformation)
(1, 7, datetime('now', '-2 hours')), (4, 7, datetime('now', '-1 hour')), (9, 7, datetime('now', '-30 min')),
(6, 7, datetime('now', '-15 min')), (2, 7, datetime('now', '-5 min')),
-- Post 9 (Neha book review)
(7, 9, datetime('now', '-5 hours')), (6, 9, datetime('now', '-4 hours')), (5, 9, datetime('now', '-2 hours')),
-- Post 12 (Vikram Spiti)
(1, 12, datetime('now', '-20 hours')), (6, 12, datetime('now', '-18 hours')), (8, 12, datetime('now', '-15 hours')),
(10, 12, datetime('now', '-12 hours')), (4, 12, datetime('now', '-10 hours')),
-- Post 14 (Ananya new song)
(8, 14, datetime('now', '-3 hours')), (1, 14, datetime('now', '-2 hours')), (4, 14, datetime('now', '-1 hour')),
(9, 14, datetime('now', '-30 min')),
-- Post 16 (Karan seed round)
(3, 16, datetime('now', '-6 hours')), (5, 16, datetime('now', '-5 hours')), (6, 16, datetime('now', '-4 hours')),
(10, 16, datetime('now', '-3 hours')),
-- Post 19 (Sneha art)
(4, 19, datetime('now', '-20 hours')), (6, 19, datetime('now', '-19 hours')), (1, 19, datetime('now', '-18 hours')),
-- Post 25 (Ishita planting)
(2, 25, datetime('now', '-4 hours')), (3, 25, datetime('now', '-3 hours')), (5, 25, datetime('now', '-2 hours')),
(7, 25, datetime('now', '-1 hour')), (8, 25, datetime('now', '-30 min')),
-- Random likes across other posts
(3, 2, datetime('now', '-1 day')), (6, 5, datetime('now', '-1 day')),
(9, 10, datetime('now', '-1 day')), (2, 13, datetime('now', '-2 days')),
(7, 15, datetime('now', '-1 day')), (10, 18, datetime('now', '-3 days')),
(5, 20, datetime('now', '-2 days')), (9, 24, datetime('now', '-3 days'));

-- =============================================
-- FOLLOWS (network of connections)
-- =============================================
INSERT INTO follows (follower_id, following_id, created_at) VALUES
-- Aarav follows
(1, 2, datetime('now', '-10 days')), (1, 5, datetime('now', '-8 days')), (1, 8, datetime('now', '-5 days')),
(1, 10, datetime('now', '-2 days')),
-- Priya follows
(2, 1, datetime('now', '-9 days')), (2, 5, datetime('now', '-7 days')), (2, 10, datetime('now', '-3 days')),
-- Rahul follows
(3, 4, datetime('now', '-6 days')), (3, 7, datetime('now', '-4 days')), (3, 1, datetime('now', '-2 days')),
-- Neha follows
(4, 6, datetime('now', '-8 days')), (4, 8, datetime('now', '-5 days')), (4, 7, datetime('now', '-3 days')),
(4, 1, datetime('now', '-1 day')),
-- Vikram follows
(5, 1, datetime('now', '-7 days')), (5, 10, datetime('now', '-5 days')), (5, 3, datetime('now', '-3 days')),
-- Ananya follows
(6, 4, datetime('now', '-6 days')), (6, 8, datetime('now', '-4 days')), (6, 7, datetime('now', '-2 days')),
-- Karan follows
(7, 3, datetime('now', '-5 days')), (7, 5, datetime('now', '-3 days')), (7, 9, datetime('now', '-1 day')),
-- Sneha follows
(8, 1, datetime('now', '-9 days')), (8, 4, datetime('now', '-6 days')), (8, 6, datetime('now', '-3 days')),
-- Rohit follows
(9, 7, datetime('now', '-4 days')), (9, 6, datetime('now', '-2 days')),
-- Ishita follows
(10, 2, datetime('now', '-8 days')), (10, 5, datetime('now', '-6 days')), (10, 1, datetime('now', '-4 days')),
(10, 7, datetime('now', '-2 days'));