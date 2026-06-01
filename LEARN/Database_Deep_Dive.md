# DATABASE DESIGN - DEEP DIVE

## What is a Database?

A database is an organized collection of data stored electronically. Think of it like a digital filing cabinet.

## Why SQL?

- **S**tructured **Q**uery **L**anguage
- Industry standard for 40+ years
- Powers Facebook, Instagram, Twitter (X), LinkedIn
- Handles MILLIONS of users efficiently

## Interview Question #1:
"What is the difference between SQL and NoSQL?"

| SQL | NoSQL |
|-----|-------|
| Structured data in tables | Flexible document storage |
| Fixed schema (columns defined) | Dynamic schema |
| Relations via JOINs | Denormalized data |
| ACID compliant (reliable) | Scalability focused |
| Examples: MySQL, PostgreSQL | Examples: MongoDB, Redis |

**Real-world**: Social media apps use SQL for core data (users, posts, transactions) because reliability matters. Twitter used MySQL for tweets, Facebook used MySQL for social graph.

---

## Understanding TABLES

A table is like a spreadsheet:
- **Columns** = categories of data (like "Name", "Age")
- **Rows** = individual records (like one specific user)

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### KEY CONCEPTS Explained:

#### 1. PRIMARY KEY (PK)
- **What**: A column that uniquely identifies each row
- **Why**: You need a way to find ONE specific user among millions
- **Rules**:
  - Must be unique (no duplicates)
  - Cannot be NULL (empty)
  - Each table has ONE primary key
- **Interview Question**: "Can a table have multiple primary keys?"
  - Answer: Yes! A composite primary key uses multiple columns together (e.g., PRIMARY KEY (user_id, post_id) in a likes table)

#### 2. NOT NULL
- Means this column MUST have a value
- You can't create a user without a username

#### 3. UNIQUE
- No two rows can have the same value in this column
- Email must be unique so each user has one account

#### 4. DEFAULT
- If no value provided, use this default
- `DEFAULT CURRENT_TIMESTAMP` = set to current time automatically

---

## DEEP DIVE: Our Schema

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Likes table (critical for understanding Many-to-Many)
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE(user_id, post_id) -- Prevents same user liking same post twice
);

-- Follows table (self-referential Many-to-Many)
CREATE TABLE follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id),
    UNIQUE(follower_id, following_id) -- Can't follow same person twice
);
```

---

## UNDERSTANDING RELATIONSHIPS

### Type 1: ONE-TO-MANY (User → Posts)

**Real-world analogy**: One user can have MANY posts, but each post belongs to ONE user.

**How it works in SQL**:
- The "many" side (posts) has a FOREIGN KEY pointing to the "one" side (users)
- `user_id INTEGER NOT NULL` in posts table REFERENCES users(id)

**Interview Question**: "Why is the foreign key on the many side?"
- Because we need to know WHO created each post
- If we put user_id on users table, a user could only make ONE post (impossible!)

### Type 2: MANY-TO-MANY (Users ↔ Posts via Likes)

**Real-world analogy**:
- One user can like MANY posts
- One post can be liked by MANY users
- This is a MANY-TO-MANY relationship

**How it works in SQL**:
- We need a BRIDGE/JUNCTION table called `likes`
- It holds pairs of (user_id, post_id)
- Each pair is unique (UNIQUE constraint)
- Together, they form a composite key

**Visual representation**:
```
Users          Likes (bridge)       Posts
┌────┐        ┌─────────────┐      ┌────┐
│ 1  │───<    │ user │ post │      │ 10 │
└────┘        │  1   │  10  │      └────┘
┌────┐        │  2   │  10  │      ┌────┐
│ 2  │───<    └─────────────┘      │ 11 │
└────┘                               └────┘
```

### Type 3: MANY-TO-MANY (Users ↔ Users via Follows)

**Real-world analogy**:
- User A can follow User B
- User A can also follow User C
- User B can also be followed by A, C, D...

**Critical insight**: This is a SELF-REFERENTIAL relationship
- The table references ITSELF
- follower_id points to users(id)
- following_id points to users(id)

---

## SQL QUERIES - Deep Dive

### SELECT with JOINs

```sql
-- Get all posts with user information (INNER JOIN)
SELECT
    posts.id,
    posts.content,
    posts.created_at,
    users.username,
    users.avatar_url
FROM posts
INNER JOIN users ON posts.user_id = users.id
ORDER BY posts.created_at DESC;
```

**Interview Question**: "What's the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN?"

| Join Type | What it does |
|-----------|--------------|
| INNER JOIN | Only rows that exist in BOTH tables |
| LEFT JOIN | ALL rows from left table + matching from right |
| RIGHT JOIN | Matching from left + ALL rows from right |
| FULL OUTER | ALL rows from both (even if no match) |

**Real-world analogy**:
- INNER JOIN: "Show me posts that have users" (every post has a creator)
- LEFT JOIN: "Show me all users, even if they haven't posted" (maybe for admin panel)

### Subqueries

```sql
-- Get posts with like count
SELECT
    posts.content,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
FROM posts;
```

### Aggregation with GROUP BY

```sql
-- Get number of posts per user
SELECT
    users.username,
    COUNT(posts.id) as post_count
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.username
ORDER BY post_count DESC;
```

---

## INDEXES - Critical for Performance

**Interview Question**: "What is a database index and why do we use it?"

**Without index**: Reading a book without an index - you must check EVERY page
**With index**: Like a book's index - instant lookup by topic

```sql
-- Without index: Full table scan (slow for millions of rows)
SELECT * FROM posts WHERE user_id = 5;

-- With index: Direct lookup (instant even with millions)
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

**When to index**:
- Foreign keys (ALWAYS create indexes)
- Columns you search/filter by
- Columns you sort by

**When NOT to index**:
- Columns with low variety (e.g., boolean flags - mostly TRUE or FALSE)
- Tables with infrequent reads but frequent writes
- Small tables (full scan is faster than index lookup overhead)

**Interview follow-up**: "What are the downsides of indexes?"
- They take up storage space
- Slow down INSERT/UPDATE/DELETE (must update index)
- Over-indexing is a common mistake

---

## TRANSACTIONS - ACID Properties

When you do multiple operations that MUST succeed together:

```sql
BEGIN TRANSACTION;

-- Transfer money from account A to account B
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If anything fails, ROLLBACK (undo everything)
COMMIT; -- Save changes permanently
```

**ACID explained**:
- **A**tomicity: All or nothing (can't partially transfer money)
- **C**onsistency: Database always in valid state (balance never goes negative)
- **I**solation: Concurrent transactions don't interfere (two transfers at same time)
- **D**urability: Once committed, data persists even if database crashes

**Interview Question**: "How do you prevent deadlocks?"
- Lock resources in consistent order (always update accounts in ID order)
- Keep transactions short
- Use appropriate isolation levels

---

## SQL INTERVIEW CHEAT SHEET

### Basic Commands:
```sql
SELECT * FROM table WHERE condition;
INSERT INTO table (col1, col2) VALUES (val1, val2);
UPDATE table SET col = value WHERE condition;
DELETE FROM table WHERE condition;
```

### Complex Queries:
```sql
-- WHERE with multiple conditions
SELECT * FROM posts WHERE user_id = 1 AND created_at > '2024-01-01';

-- LIKE for partial matching
SELECT * FROM users WHERE username LIKE 'john%';

-- LIMIT and OFFSET for pagination
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20;

-- HAVING for aggregate filtering
SELECT user_id, COUNT(*) as cnt FROM posts GROUP BY user_id HAVING cnt > 5;
```

### Common Pitfalls:
1. **SQL Injection** - Always use parameterized queries
2. **N+1 Query Problem** - Use JOINs or eager loading, not loops
3. **Missing Indexes** - Profile slow queries
4. **Not handling NULL** - Use COALESCE or IFNULL

---

## Next Step

Now that you understand DATABASE design, let's:
1. Set up the actual SQLite database
2. Run these SQL commands to create tables
3. Seed with sample data

Ready to continue?