import { client } from "@/lib/db";
import { DraftData, EditDraftData, IDraft, RepoReturn } from "@/types";

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

export const getUserDrafts = async (
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

export const deleteDraft = async ({
  draftId,
}: {
  draftId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE drafts SET isDeleted = 1 WHERE id = ?",
    args: [draftId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const getDraft = async ({
  draftId,
}: {
  draftId: number;
}): Promise<RepoReturn<{ draft: IDraft }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM drafts WHERE id = ? AND isDeleted = 0",
    args: [draftId],
  });

  if (rows.length === 0) {
    return { errorCode: "post_not_found" };
  }

  return {
    data: { draft: rows[0] as unknown as IDraft },
  };
};

export const editDraft = async (
  data: Omit<EditDraftData, "tags"> & { tags: string }
): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE drafts SET title = ?, summary = ?, coverImage = ?, tags = ?, content = ? WHERE id = ?",
    args: [
      data.title,
      data.summary,
      data.coverImage,
      data.tags,
      data.content,
      data.id,
    ],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};
