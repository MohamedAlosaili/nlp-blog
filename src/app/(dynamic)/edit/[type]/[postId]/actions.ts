"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { EditDraftData, EditPostData } from "@/types";
import * as postsRepo from "@/repos/posts";
import * as draftsRepo from "@/repos/drafts";
import { revalidatePath } from "next/cache";

export const editPostAction = async (data: EditPostData) =>
  asyncHandler(async () => {
    const { errorCode } = await postsRepo.editPost(data);

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    revalidatePath(`/posts/${data.id}`);
    revalidatePath(`/`);
    return { data: { post: data } };
  });

export const editDraftAction = async (data: EditDraftData) =>
  asyncHandler(async () => {
    const tags = data.tags.map(tag => tag.id).join(",");

    const draftData = { ...data, tags };
    await draftsRepo.editDraft(draftData);

    revalidatePath("/posts/my");
    return {};
  });
