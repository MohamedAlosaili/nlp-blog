import { client } from "@/lib/db";
import { CommentData, IComment, RepoReturn } from "@/types";

export const getPostComments = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn<{ comments: IComment[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM comments WHERE postId = ? AND isDeleted = 0 ORDER BY createdAt DESC",
    args: [postId],
  });

  return { data: { comments: rows as unknown as IComment[] } };
};

export const createComment = async (data: CommentData): Promise<RepoReturn> => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO comments (content, senderName, userId, postId) VALUES (?, ?, ?, ?)",
    args: [data.content, data.senderName, data.userId ?? null, data.postId],
  });

  if (!lastInsertRowid) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};
