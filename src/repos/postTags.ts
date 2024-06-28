import { client } from "@/lib/db";
import { RepoReturn, Tag } from "@/types";
import { Transaction } from "@libsql/client";

export const addPostTag = async ({
  postId,
  tagId,
  transaction,
}: {
  postId: number;
  tagId: number;
  transaction?: Transaction;
}): Promise<RepoReturn> => {
  const { lastInsertRowid } = await (transaction ?? client).execute({
    sql: "INSERT INTO postTags (postId, tagId) VALUES (?, ?)",
    args: [postId, tagId],
  });

  if (!lastInsertRowid) {
    return { errorCode: "internal_server_error" };
  }

  return {
    data: {
      postTag: {
        id: parseInt(lastInsertRowid.toString()),
        postId,
        tagId,
      },
    },
  };
};

export const getPostTags = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn<{ tags: Tag[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT id, name FROM tags t, postTags pt WHERE t.id = pt.tagId AND pt.postId = ?",
    args: [postId],
  });

  return {
    data: {
      tags: (rows as unknown as Tag[]).map(tag => ({
        ...tag,
        id: parseInt(tag.id.toString()),
      })),
    },
  };
};

export const deletePostTags = async ({
  postId,
  transaction,
}: {
  postId: number;
  transaction?: Transaction;
}): Promise<RepoReturn> => {
  await (transaction ?? client).execute({
    sql: "DELETE FROM postTags WHERE postId = ?",
    args: [postId],
  });

  return {};
};
