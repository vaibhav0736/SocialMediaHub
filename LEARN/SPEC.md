# Social Media Hub - Full Stack Learning Project

## What We're Building

A Social Media Hub application where users can:
- Create accounts and profiles
- Make posts with text and images
- Like and comment on posts
- Follow/unfollow other users
- View a personalized news feed

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React.js (Vite) | Modern, fast, industry-standard |
| Backend | Node.js + Express | JavaScript end-to-end, easy to learn |
| Database | SQLite + SQL | Real SQL, zero setup, portable |
| Language | JavaScript/TypeScript | One language to rule them all |

## Learning Phases

### Phase 1: Project Setup & Architecture
- Setting up the project structure
- Understanding client-server architecture
- REST API fundamentals

### Phase 2: Database Design (SQL Mastery)
- Designing database schema
- Writing SQL queries
- Relationships (Foreign Keys)
- JOIN operations

### Phase 3: Backend Development
- Building REST API endpoints
- Express.js middleware
- Authentication (JWT)
- API security

### Phase 4: Frontend Development
- React components
- State management
- API integration
- Routing

### Phase 5: Integration & Polish
- Connecting frontend to backend
- Error handling
- Loading states
- Deployment

## Interview Questions Coverage

Throughout the journey, we'll cover:
- SQL queries, joins, indexes
- REST API design
- React hooks and state
- Authentication/Authorization
- Performance optimization
- System design basics

## Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │   Posts     │       │   Comments  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──────<│ user_id (FK)│       │ id (PK)     │
│ username    │       │ content     │       │ post_id (FK)│
│ email       │       │ image_url   │──────<│ user_id (FK)│
│ password    │       │ created_at   │       │ content     │
│ created_at  │       └─────────────┘       │ created_at  │
└─────────────┘              │              └─────────────┘
       │                     │
       │              ┌─────────────┐
       │              │   Likes     │
       └─────────────>│ user_id (FK)│
                      │ post_id (FK)│
                      │ created_at  │
                      └─────────────┘
                             │
                      ┌─────────────┐
                      │  Follows    │
                      │ follower_id │
                      │ following_id│
                      └─────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create new user |
| POST | /api/auth/login | User login |
| GET | /api/users/:id | Get user profile |
| GET | /api/posts | Get all posts (feed) |
| POST | /api/posts | Create a post |
| POST | /api/posts/:id/like | Like a post |
| POST | /api/posts/:id/comment | Comment on post |
| POST | /api/users/:id/follow | Follow a user |

## Project Structure

```
social-media-hub/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

*This project is designed for learning. Every concept will be explained deeply with real examples and interview preparation.*