import { client } from "@/lib/db";
import { RepoReturn, Tag } from "@/types";

export const addPostTag = async ({
  postId,
  tagId,
}: {
  postId: number;
  tagId: number;
}): Promise<RepoReturn> => {
  const { lastInsertRowid } = await client.execute({
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
      tags: rows as unknown as Tag[],
    },
  };
};

export const deletePostTags = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  await client.execute({
    sql: "DELETE FROM postTags WHERE postId = ?",
    args: [postId],
  });

  return {};
};
