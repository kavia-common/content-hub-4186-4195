# Blog Database (MongoDB + Mongoose)

This package contains the Mongoose models and MongoDB connection helper for the full‑stack blog application. It is designed to be consumed by the Express.js backend container.

## Environment variables

Create a .env file (or use your orchestrator to inject envs) using .env.example as a reference:

- MONGODB_URL: Mongo connection string WITHOUT the database name (e.g., mongodb://user:pass@host:port/?authSource=admin)
- MONGODB_DB: Target database name (e.g., myapp)
- MONGODB_POOL_SIZE: Optional max pool size (default 10)
- MONGODB_MIN_POOL_SIZE: Optional min pool size (default 2)
- MONGODB_MAX_IDLE_TIME_MS: Optional max idle time (default 30000)

Never commit secrets. .env.example is provided for reference only.

## Models

- User: Authentication and roles (admin, author, user), profile fields
- Post: Title, content, slug, author, categories/tags, draft/publish workflow, likes, SEO
- Comment: Per-post comments with support for replies and likes
- Category: Unique categories with slug
- Tag: Unique tags with slug

All models include timestamps and proper indexes.

## Usage (from Express backend)

Install this package locally (monorepo) or set NODE_PATH to load modules across containers. Then:

```js
// example in blog_backend_api
import { initDatabase, User, Post, Comment, Category, Tag } from '../../content-hub-4186-4195/blog_database/src/index.js';

await initDatabase();

// Use models
const posts = await Post.find({ status: 'published' }).limit(10);
```

## Local testing

```bash
cd content-hub-4186-4195/blog_database
cp .env.example .env  # then edit with valid values as needed
npm install
npm run dev
```

You should see "MongoDB connected successfully" if the connection works.

## Notes

- Slugs are generated from names/titles if omitted.
- Post.status automatically sets publishedAt on first transition to 'published'.
- likes fields are arrays of User ObjectId (simple upvote/like system).
- Comment.parent enables threaded replies.
