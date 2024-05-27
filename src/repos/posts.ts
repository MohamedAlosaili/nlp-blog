import { client } from "@/lib/db";
import { NewPostData, RepoReturn } from "@/types";

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
