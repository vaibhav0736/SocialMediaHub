# HOW TO THINK ABOUT WRITING API ROUTES

## The Mindset: Route = Answering a Question

Every API endpoint answers ONE question. Start by asking:

| Endpoint | Question it answers |
|----------|-------------------|
| POST /register | "Can you create my account?" |
| POST /login | "Am I who I say I am?" |
| GET /posts | "What's happening right now?" |
| POST /posts | "Can I share something?" |
| POST /posts/:id/like | "Can I like this?" |
| GET /users/:id | "Who is this person?" |

## The 4-Step Pattern for EVERY Route

```
1. RECEIVE  →  Get data from the request (req.body, req.params)
2. VALIDATE →  Check: is this data valid? Does this thing exist?
3. EXECUTE  →  Run the SQL query
4. RESPOND  →  Send back the result
```

Let's apply this to auth.js...

---

## WRITING auth.js — Step by Step Thinking

### Step 1: What does this file need to DO?

```
auth.js needs:
  - Register: Create a new user in the database
  - Login:   Verify a user's email and password
```

### Step 2: What TOOLS does it need? (require statements)

Think: "What external things do I need to borrow?"

- **express Router** → To create route handlers (app.get, app.post etc but modular)
- **bcrypt** → To hash passwords (so we never store real passwords)
- **jsonwebtoken (jwt)** → To create login tokens (like a digital ID card)
- **Database helper functions** → getOne() and run() from your db.js

```javascript
const express = require('express');     // ← Router lives here
const bcrypt = require('bcryptjs');      // ← Password hashing
const jwt = require('jsonwebtoken');     // ← Token generation
const { getOne, run } = require('../database/db');  // ← Your helpers
```

**Interview Q**: "Why do we import specific functions (getOne, run) instead of the whole db object?"
**Answer**: Destructuring keeps your code clean. You only import what you actually use.

### Step 3: The Register Route — THINK IT THROUGH

Ask yourself: "What flow does a user go through when registering?"

```
USER STEPS (real world)       OUR CODE STEPS
─────────────────────         ─────────────────
1. Fill registration form  →  1. RECEIVE: req.body has username, email, password
2. See "Email taken" error →  2. VALIDATE: Check if email/username already exists
3. Account created         →  3. EXECUTE: Hash password + INSERT into users
4. Auto-logged in          →  4. RESPOND: Send back token + user info
```

**The code thinking process:**

```
// THINK: I need a POST endpoint at /register
// Because we're CREATING a new user (POST = create)

router.post('/register', async (req, res) => {

    // THINK: What data do I need from the user?
    // Answer: username, email, password
    const { username, email, password } = req.body;

    // THINK: What could go wrong?
    // 1. Fields are empty
    // 2. Password too short
    // 3. Email/username already exists

    if (!username || !email || !password)
        → respond "All fields required"

    if (password.length < 6)
        → respond "Password too short"

    // THINK: How to check if user exists?
    // Need SQL: SELECT id FROM users WHERE email = ? OR username = ?
    // Use getOne() because I only need 1 row

    const existing = getOne(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
    );
    if (existing)
        → respond "User already exists"

    // THINK: Now store the user
    // IMPORTANT: Never store raw password! Hash it first
    // bcrypt.hash(password, 10) → 10 = salt rounds (security level)

    const hashedPassword = await bcrypt.hash(password, 10);

    // THINK: Now INSERT. Use run() because we're writing data
    const result = run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );

    // THINK: User should be logged in immediately
    // Create a JWT token = digital ID card
    // Payload = info we want stored in the token
    const token = jwt.sign(
        { userId: result.lastInsertRowid, username },  // payload
        JWT_SECRET,                                      // secret key
        { expiresIn: '7d' }                             // expires in 7 days
    );

    // THINK: What does frontend need?
    // - Token (for future requests)
    // - User info (to show their name)
    res.status(201).json({
        token,
        user: { id: result.lastInsertRowid, username, email }
    });
});
```

### Step 4: The Login Route — THINK IT THROUGH

```
USER STEPS                OUR CODE
────────────              ────────
1. Enter email+password → 1. RECEIVE: req.body
2. "Wrong password"     → 2. Find user by email, compare passwords
3. Logged in             → 3. Generate token, send back
```

**The thinking:**

```
router.post('/login', async (req, res) => {

    // THINK: Receive email and password
    const { email, password } = req.body;

    // THINK: Find the user by email
    const user = getOne('SELECT * FROM users WHERE email = ?', [email]);

    // THINK: What if user doesn't exist?
    // SECURITY: Say "Invalid credentials" not "User not found"
    // Why? If you say "User not found", attackers know which emails exist
    if (!user)
        → respond 401 "Invalid credentials"

    // THINK: Check if password matches
    // bcrypt.compare(enteredPassword, storedHash) → true/false
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        → respond 401 "Invalid credentials"

    // THINK: Same as register — generate token, send back
    const token = jwt.sign(...)
    res.json({ token, user: {...} })
});
```

---

## THE PATTERN TO MEMORIZE

For EVERY route in this app, think:

```
1. WHAT question does this answer?
2. WHAT data do I need from the request?  (req.body / req.params)
3. WHAT could go wrong?                  (validation)
4. WHAT SQL do I need?                   (getOne / getAll / run)
5. WHAT does the frontend need back?     (response shape)
```

---

## NOW YOU WRITE IT

Open `backend/routes/auth.js` and write the code yourself following the thinking above.

**Your checklist:**
- [ ] Import express, bcrypt, jwt, db helpers
- [ ] Create router
- [ ] Define JWT_SECRET
- [ ] POST /register route with all 4 steps
- [ ] POST /login route with all 4 steps
- [ ] Export router

**Don't scroll up to copy** — write it from understanding. If you get stuck, ask me about a specific step.

---

---

## WRITING posts.js — Step by Step Thinking

### Step 1: What does this file need to DO?

```
posts.js needs to answer these questions:
  - Feed:       "What's everyone talking about?"
  - Single post:"Show me this post with its comments"
  - Create:     "I want to share something"
  - Like:       "I like this post"
  - Unlike:     "Never mind, I don't like it"
  - Comment:    "Let me reply to this"
  - User posts: "Show me what this person has posted"
```

### Step 2: What TOOLS does it need?

Unlike auth.js, posts.js does NOT need bcrypt or jwt. It only needs:

```javascript
const express = require('express');
const { getOne, getAll, run } = require('../database/db');
```

**Why no bcrypt/jwt?** bcrypt is only for passwords. jwt is only for login tokens. posts.js just reads and writes data — no security operations.

---

### Step 3: GET / — The Feed

**Question it answers:** "What's everyone posting right now?"

```
RECEIVE:  Nothing. Just GET request.
VALIDATE: Nothing. Public feed.
EXECUTE:  Fetch all posts, newest first, with author info + like count + comment count.
RESPOND:  JSON array of posts.
```

**Think:** What information does the frontend need to RENDER a post?

```
Each post in the feed needs:
  - Post: id, content, image_url, created_at     ← From posts table
  - Author: user_id, username, avatar_url          ← From users table (JOIN)
  - Likes:  like_count                              ← Subquery count
  - Comments: comment_count                         ← Subquery count
```

**The SQL thinking:**

```sql
-- Start with posts (main data)
SELECT posts.id, posts.content, posts.image_url, posts.created_at
FROM posts

-- Add author info via JOIN
INNER JOIN users ON posts.user_id = users.id

-- But I also need username and avatar_url from users table
SELECT ..., users.username, users.avatar_url

-- How do I get LIKE COUNT for each post?
-- SUBQUERY: A query inside a query
-- It runs for EACH post and counts its likes
(SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count

-- Same for comment count
(SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count

-- Show newest first
ORDER BY posts.created_at DESC
```

**The code:**

```javascript
router.get('/', (req, res) => {
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
            (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `);
    res.json(posts);
});
```

**Interview Q:** "What is a subquery?"
**A:** A SELECT statement inside another SELECT. It runs once per row of the outer query. Great for counting related data without extra roundtrips.

---

### Step 4: GET /:id — Single Post with Comments

**Question:** "Show me this specific post and all its comments"

```
RECEIVE:  req.params.id  (e.g., /api/posts/3 → id = 3)
VALIDATE: Does this post exist? If not → 404
EXECUTE:  2 queries — (1) get post, (2) get comments
RESPOND:  Post object with comments array attached
```

**Think Flow:**

```
1. req.params.id is a STRING. Parse it: parseInt(req.params.id)
2. Query for the post using WHERE posts.id = ?
3. If no post found → return 404 "Post not found"
4. Query for comments WHERE comments.post_id = ?
5. Send back post with comments: { ...post, comments: [...] }
```

**Comments query needs JOIN too:**

```sql
SELECT comments.id, comments.content, comments.created_at,
       users.id as user_id, users.username, users.avatar_url
FROM comments
INNER JOIN users ON comments.user_id = users.id
WHERE comments.post_id = ?
ORDER BY comments.created_at ASC
```

**The code:**

```javascript
router.get('/:id', (req, res) => {
    const postId = parseInt(req.params.id);

    const post = getOne(`
        SELECT posts.*, users.username, users.avatar_url,
               (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `, [postId]);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const comments = getAll(`
        SELECT comments.id, comments.content, comments.created_at,
               users.id as user_id, users.username, users.avatar_url
        FROM comments
        INNER JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `, [postId]);

    res.json({ ...post, comments });
});
```

---

### Step 5: POST / — Create a Post

**Question:** "Can I share something with the world?"

```
RECEIVE:  req.body = { userId, content, imageUrl }
VALIDATE: Must have content OR imageUrl (at least one)
EXECUTE:  INSERT into posts → SELECT the created post (with user info)
RESPOND:  The new post (status 201 = Created)
```

**The code:**

```javascript
router.post('/', (req, res) => {
    const { userId, content, imageUrl } = req.body;

    if (!content && !imageUrl) {
        return res.status(400).json({ error: 'Post must have content' });
    }

    const result = run(
        'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
        [userId, content || '', imageUrl || '']
    );

    // Fetch the post we just created with author info
    const newPost = getOne(`
        SELECT posts.*, users.username, users.avatar_url
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `, [result.lastInsertRowid]);

    res.status(201).json(newPost);
});
```

**Interview Q:** "Why do we SELECT the post after INSERTING?"
**A:** The INSERT only returns the new ID (`lastInsertRowid`). We need full post data + username + avatar_url to show in the UI. Plus, the `created_at` is set by the database — we need to read it back.

---

### Step 6: POST /:id/like — Like a Post

**Question:** "Can I like this post?"

```
RECEIVE:  req.params.id = post ID,  req.body.userId = who's liking
VALIDATE: Post exists? Already liked? (UNIQUE constraint prevents duplicates)
EXECUTE:  INSERT INTO likes → count likes
RESPOND:  { message: "Liked", like_count: N }
```

**The code:**

```javascript
router.post('/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.body.userId;

    // Validate: Post exists?
    const post = getOne('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    // Validate: Already liked?
    const existing = getOne(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
    if (existing) {
        return res.status(400).json({ error: 'Already liked' });
    }

    // Execute: Create like
    run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);

    // Get updated count
    const count = getOne('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);

    res.json({ message: 'Liked', like_count: count.count });
});
```

---

### Step 7: DELETE /:id/like — Unlike

**Question:** "Never mind, remove my like"

```
RECEIVE:  req.params.id, req.body.userId
VALIDATE: Was it liked? result.changes === 0 → wasn't liked
EXECUTE:  DELETE FROM likes WHERE user_id = ? AND post_id = ?
RESPOND:  { message: "Unliked", like_count: N }
```

**The code:**

```javascript
router.delete('/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.body.userId;

    const result = run(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );

    if (result.changes === 0) {
        return res.status(400).json({ error: 'Not liked' });
    }

    const count = getOne('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);

    res.json({ message: 'Unliked', like_count: count.count });
});
```

**Interview Q:** "What is `result.changes`?"
**A:** It's the number of rows affected by the query. If 0, the DELETE didn't match any row — meaning the like didn't exist.

---

### Step 8: POST /:id/comment — Add a Comment

**Question:** "Let me reply to this post"

```
RECEIVE:  req.params.id = post ID,  req.body = { userId, content }
VALIDATE: Content not empty? Post exists?
EXECUTE:  INSERT INTO comments → SELECT comment + user info
RESPOND:  The new comment object (status 201)
```

**The code:**

```javascript
router.post('/:id/comment', (req, res) => {
    const postId = parseInt(req.params.id);
    const { userId, content } = req.body;

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

    res.status(201).json(newComment);
});
```

---

### Step 9: GET /user/:userId — Posts by a User

**Question:** "What has this person posted?"

```
RECEIVE:  req.params.userId
VALIDATE: Nothing special
EXECUTE:  Same as feed query but add WHERE posts.user_id = ?
RESPOND:  Array of posts
```

**The code:**

```javascript
router.get('/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    const posts = getAll(`
        SELECT 
            posts.id, posts.content, posts.image_url, posts.created_at,
            users.id as user_id, users.username, users.avatar_url,
            (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC
    `, [userId]);

    res.json(posts);
});
```

---

## POSTS.JS — Complete Thinking Summary

| Route | RECEIVE | VALIDATE | EXECUTE | RESPOND |
|-------|---------|----------|---------|---------|
| GET / | — | — | getAll all posts + JOIN | Array of posts |
| GET /:id | req.params.id | Post exists? | getOne + getAll comments | Post + comments |
| POST / | req.body(text) | Content not empty | run INSERT → getOne | New post (201) |
| POST /:id/like | params.id, body.userId | Post exists? Liked? | run INSERT → getOne count | Like count |
| DELETE /:id/like | params.id, body.userId | Was liked? | run DELETE → getOne count | Like count |
| POST /:id/comment | params.id, body(userId,content) | Content? Post exists? | run INSERT → getOne | New comment (201) |
| GET /user/:userId | req.params.userId | — | getAll + WHERE | Array of posts |

---

## NOW WRITE posts.js

Open `backend/routes/posts.js` and write each route using the pattern:

1. What do I RECEIVE?
2. What do I VALIDATE?
3. What SQL do I EXECUTE?
4. What do I RESPOND?

Start writing!
