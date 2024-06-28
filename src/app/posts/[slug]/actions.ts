"use server";

import { getIdFromToken } from "@/helpers/getIdFromToken";
import { ActionReturn, CommentFormData } from "@/types";
import { revalidateTag } from "next/cache";
import * as commentsRepo from "@/repos/comments";

export const sendCommentAction = async (
  formData: CommentFormData
): Promise<ActionReturn> => {
  const { postId, senderName, content } = formData;
  const id = getIdFromToken();
  if (!senderName?.trim() || !content?.trim()) {
    return { errorCode: "internal_server_error" };
  }

  if (content.length > 1000) {
    return { errorCode: "content_too_long" };
  }

  const data = {
    senderName,
    content,
    postId,
    userId: id,
  };

  await commentsRepo.createComment(data);

  revalidateTag(`post_${postId}_comments`);
  return {};
};
