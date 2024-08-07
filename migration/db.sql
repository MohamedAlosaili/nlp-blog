-- Date: 2024-05-23
DROP TABLE comments;
DROP TABLE postTags;
DROP TABLE Tags;
DROP TABLE Posts;
DROP TABLE Drafts;
DROP TABLE Users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL unique,
    password TEXT NOT NULL,
    photo TEXT,
    phone TEXT,
    verified INTEGER NOT NULL DEFAULT 0,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    resetPasswordToken TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    coverImage TEXT,
    tags TEXT, -- comma separated tag ids
    content TEXT NOT NULL,
    userId INTEGER NOT NULL,
    postId INTEGER,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
    FOREIGN KEY (postId) REFERENCES posts(id)
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    coverImage TEXT,
    content TEXT NOT NULL,
    userId INTEGER NOT NULL,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    isPublished INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE postTags (
    postId INTEGER NOT NULL,
    tagId INTEGER NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
    FOREIGN KEY (tagId) REFERENCES tags(id)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    senderName TEXT NOT NULL,
    userId INTEGER NOT NULL,
    postId INTEGER NOT NULL,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
);

CREATE INDEX comments_postId_index ON comments(postId); 

ALTER TABLE Drafts ADD authorName TEXT;
ALTER TABLE Posts ADD authorName TEXT;

ALTER TABLE Posts ADD slug TEXT;
ALTER TABLE Drafts ADD slug TEXT;
-- prevent duplicate in non-nulls slugs
CREATE UNIQUE INDEX post_slug_index ON posts(slug)
WHERE (slug IS NOT NULL);

ALTER TABLE Users ADD role TEXT DEFAULT 'user';