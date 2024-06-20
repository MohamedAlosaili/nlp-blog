import { client } from "@/lib/db";
import { EditPostData, IPost, NewPostData, RepoReturn } from "@/types";

export const createNewPost = async (data: NewPostData): Promise<RepoReturn> => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO posts (title, authorName, summary, coverImage, content, userId) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      data.title,
      data.authorName ?? null,
      data.summary,
      data.coverImage,
      data.content,
      data.userId,
    ],
  });

  if (!lastInsertRowid) {
    return { errorCode: "internal_server_error" };
  }

  return {
    data: {
      post: {
        id: parseInt(lastInsertRowid.toString()),
        title: data.title,
        summary: data.summary,
        coverImage: data.coverImage,
        content: data.content,
        userId: data.userId,
      },
    },
  };
};

export const getPublishedPosts = async (): Promise<
  RepoReturn<{ posts: IPost[] }>
> => {
  const { rows } = await client.execute(
    "SELECT * FROM posts WHERE isPublished = 1 AND isDeleted = 0 ORDER BY createdAt DESC"
  );

  return {
    data: {
      posts: rows as unknown as IPost[],
    },
  };
};
export const getUserPublishedPosts = async (
  userId: number
): Promise<RepoReturn<{ posts: IPost[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM posts WHERE userId = ? AND isPublished = 1 AND isDeleted = 0",
    args: [userId],
  });

  return {
    data: {
      posts: rows as unknown as IPost[],
    },
  };
};

export const getUserUnPublishedPosts = async (
  userId: number
): Promise<RepoReturn<{ posts: IPost[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM posts WHERE userId = ? AND isPublished = 0 AND isDeleted = 0",
    args: [userId],
  });

  return {
    data: {
      posts: rows as unknown as IPost[],
    },
  };
};

export const deletePost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET isDeleted = 1 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const unPublishPost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET isPublished = 0 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const getPost = async ({
  postId,
  onlyPublished = false,
}: {
  postId: number;
  onlyPublished?: boolean;
}): Promise<RepoReturn<{ post: IPost }>> => {
  let sql = `
    SELECT (
      CASE
        WHEN (p.authorName IS NOT NULL) THEN p.authorName
        ELSE u.name
      END
      ) AS authorName,
      p.*
    FROM posts p
    INNER JOIN users u on p.userId = u.id
    WHERE p.id = ? AND p.isDeleted = 0`;

  if (onlyPublished) {
    sql += " AND isPublished = 1";
  }
  const { rows } = await client.execute({
    sql,
    args: [postId],
  });

  if (rows.length === 0) {
    return { errorCode: "post_not_found" };
  }

  return {
    data: { post: rows[0] as unknown as IPost },
  };
};

export const editPost = async (data: EditPostData): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET title = ?, authorName = ?, summary = ?, coverImage = ?, content = ?, isPublished = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    args: [
      data.title,
      data.authorName ?? null,
      data.summary,
      data.coverImage,
      data.content,
      data.isPublished ? 1 : 0,
      data.id,
    ],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};
