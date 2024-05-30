-- Date: 2024-05-23

-- DROP TABLE IF EXISTS users;
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

CREATE INDEX users_email_index ON users(email); 

ALTER TABLE users ADD COLUMN resetPasswordToken TEXT;


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
    isPublished INTEGER NOT NULL DEFAULT 0,
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

SELECT id, name FROM tags t, postTags pt WHERE t.id = pt.tagId AND pt.postId = 1;