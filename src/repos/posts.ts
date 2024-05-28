import { client } from "@/lib/db";
import { IPost, NewPostData, RepoReturn } from "@/types";

export const createNewPost = async (data: NewPostData): Promise<RepoReturn> => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO posts (title, summary, coverImage, content, userId) VALUES (?, ?, ?, ?, ?)",
    args: [
      data.title,
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

export const getPublishedPosts = async (
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

export const getUnPublishedPosts = async (
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
