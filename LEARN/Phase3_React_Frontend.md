# REACT FRONTEND — Deep Dive

## What is React?

React is a JavaScript library for building user interfaces. Facebook created it in 2013.

### The BIG IDEA: Components

A website is built from small, reusable pieces called **components**.

```
Traditional way:                    React way:
┌─────────────────┐                ┌─────────────────┐
│  One big HTML   │                │  <App>          │
│  file with      │                │   <Navbar/>     │
│  everything     │                │   <Feed>        │
│  mixed together │                │    <Post/>      │
│                 │                │    <Post/>      │
│                 │                │    <Post/>      │
│                 │                │   </Feed>       │
│                 │                │   <Sidebar/>    │
│                 │                │  </App>         │
└─────────────────┘                └─────────────────┘
```

**Interview Q:** "What is a React component?"
**A:** A JavaScript function that returns JSX (HTML-like code). Components are reusable, composable, and can have their own state.

---

## Understanding JSX

JSX looks like HTML but it's actually JavaScript:

```jsx
// This is JSX
const greeting = <h1>Hello World</h1>;

// It compiles to this JavaScript
const greeting = React.createElement('h1', null, 'Hello World');
```

**Rules of JSX:**
1. Return a SINGLE parent element (or use `<>...</>` fragment)
2. JavaScript goes inside `{}` curly braces
3. `className` not `class` (because `class` is a JS keyword)
4. `htmlFor` not `for`
5. Close ALL tags: `<img />`, `<br />`, `<input />`

---

## The 3 React Concepts You MUST Know

### Concept 1: STATE (useState)

State is **data that changes over time**. When state changes, React re-renders the component.

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    //     ^      ^                ^
    //   value  updater       initial value

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    );
}
```

**Think of it like this:**
- `count` = the current value (like a variable)
- `setCount` = a function that CHANGES the value AND tells React to redraw
- `useState(0)` = start with value 0

**Interview Q:** "Why can't we just use a regular variable?"
**A:** React doesn't track regular variables. When they change, React won't re-render. State changes trigger re-renders.

### Concept 2: EFFECTS (useEffect)

useEffect runs code **after** React renders. Used for API calls, timers, etc.

```jsx
import { useState, useEffect } from 'react';

function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // This runs AFTER the component appears on screen
        fetch('http://localhost:3000/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []); // <-- Empty array = run ONCE when component mounts

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>{post.content}</div>
            ))}
        </div>
    );
}
```

**The dependency array `[]`:**
- `[]` → Run ONCE (on mount)
- `[postId]` → Run when `postId` changes
- Nothing → Run on EVERY render (usually bad)

**Interview Q:** "What happens if you forget the dependency array?"
**A:** The effect runs on every render, creating an infinite loop: fetch → setState → re-render → fetch → ...

### Concept 3: PROPS

Props are **data passed from parent to child**. They flow ONE direction (down).

```jsx
// Parent passes data DOWN
function Feed() {
    const posts = [/* ... */];
    return (
        <div>
            {posts.map(post => (
                <PostCard
                    key={post.id}       // React needs "key" for lists
                    username={post.username}
                    content={post.content}
                />
            ))}
        </div>
    );
}

// Child receives data via "props" parameter
function PostCard({ username, content }) {
    return (
        <div className="post">
            <h3>{username}</h3>
            <p>{content}</p>
        </div>
    );
}
```

---

## Mental Model: How React Works

```
1. YOU change state     →  setCount(5)
2. React SCHEDULES      →  "I need to re-render this component"
3. React CALLS          →  runs your function again
4. React COMPARES       →  old JSX vs new JSX (Virtual DOM diff)
5. React UPDATES        →  only changes what's different in real DOM
```

This is called the **Virtual DOM**. React doesn't touch the real DOM directly — it works on a copy, figures out what changed, then updates only those parts.

**Interview Q:** "What is the Virtual DOM?"
**A:** An in-memory copy of the real DOM. React compares old virtual DOM with new virtual DOM (diffing), and updates only the changed elements in the real DOM. This is faster than direct DOM manipulation.

---

## Our App Component Tree

```
App
├── Navbar          (logo + nav links)
├── Routes
│   ├── Feed        (home page - all posts)
│   │   └── PostCard (each post)
│   │       ├── LikeButton
│   │       ├── CommentBox
│   │       └── CommentList
│   ├── Login       (login form)
│   ├── Register    (register form)
│   ├── Profile     (user profile page)
│   └── CreatePost  (new post form)
└── Footer
```

---

## The Data Flow

```
User clicks "Like" button
        │
        ▼
LikeButton calls fetch('POST /api/posts/5/like')
        │
        ▼
Backend updates database, returns new count
        │
        ▼
setLikes(newCount) → React re-renders the button
```

**Interview Q:** "Where should API calls live in a React app?"
**A:** In the component that needs the data (using useEffect), or in a shared parent if multiple children need the same data (lifting state up).

---

## API Integration Pattern

Every API call in React follows this pattern:

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Failed');
            return res.json();
        })
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{/* render data */}</div>;
```

---

## What We'll Build (in order)

1. **Setup** — Vite + React project
2. **App Component** — Main layout with Navbar
3. **Feed Page** — Shows all posts
4. **PostCard Component** — Individual post with like/comment
5. **Login/Register** — Auth forms
6. **CreatePost** — Form to create new post
7. **Profile Page** — User profile
8. **React Router** — Navigation between pages

---

## Setup Commands

```bash
cd d:\ReactPractice\SocialMediaHub
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
```

Now open `http://localhost:5173` — you'll see the Vite + React default page.

Then we replace the boilerplate with our own components!

---

*Ready? Run the setup commands above and tell me when you're done!*