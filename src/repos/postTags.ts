import { client } from "@/lib/db";
import { RepoReturn } from "@/types";

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
