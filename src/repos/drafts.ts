import { client } from "@/lib/db";
import { DraftData, RepoReturn } from "@/types";

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
