"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import * as postsRepo from "@/repos/posts";
import * as draftsRepo from "@/repos/drafts";
import { revalidatePath } from "next/cache";

export const deletePostAction = async ({ postId }: { postId: number }) =>
  asyncHandler(async () => {
    const { errorCode } = await postsRepo.deletePost({ postId });

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    revalidatePath(`/posts/${postId}`);
    revalidatePath(`/posts`);
    revalidatePath(`/`);
    return {};
  });

export const unPublishPostAction = async ({ postId }: { postId: number }) =>
  asyncHandler(async () => {
    const { errorCode } = await postsRepo.unPublishPost({ postId });

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    revalidatePath(`/posts/${postId}`);
    revalidatePath(`/posts`);
    revalidatePath(`/`);

    return {};
  });

export const deleteDraftAction = async ({ postId }: { postId: number }) =>
  asyncHandler(async () => {
    const { errorCode } = await draftsRepo.deletePost({ postId });

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    return {};
  });
