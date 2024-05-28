import { client } from "@/lib/db";
import { DraftData, IDraft, RepoReturn } from "@/types";

export const createNewDraft = async (data: DraftData): Promise<RepoReturn> => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO drafts (title, summary, coverImage, tags, content, userId) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      data.title,
      data.summary,
      data.coverImage,
      data.tags,
      data.content,
      data.userId,
    ],
  });
  console.log("lastInsertRowid", lastInsertRowid);
  if (!lastInsertRowid) {
    return { errorCode: "internal_server_error" };
  }

  return {
    data: {
      draft: {
        id: parseInt(lastInsertRowid.toString()),
        title: data.title,
        summary: data.summary,
        coverImage: data.coverImage,
        tags: data.tags,
        content: data.content,
        userId: data.userId,
      },
    },
  };
};

export const getDrafts = async (
  userId: number
): Promise<RepoReturn<{ drafts: IDraft[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM drafts WHERE userId = ? AND isDeleted = 0",
    args: [userId],
  });

  return {
    data: {
      drafts: rows as unknown as IDraft[],
    },
  };
};

export const deletePost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE drafts SET isDeleted = 1 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};
