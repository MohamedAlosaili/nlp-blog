"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { EditDraftData, EditPostData } from "@/types";
import * as postsRepo from "@/repos/posts";
import * as draftsRepo from "@/repos/drafts";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";

export const editPostAction = async (data: EditPostData) =>
  asyncHandler(async () => {
    const slug = slugify(data.slug);
    const isSlugExists = await postsRepo.isSlugExists({
      slug,
      postId: data.id,
    });

    if (isSlugExists) {
      return { errorCode: "slug_duplicated" };
    }

    const { errorCode } = await postsRepo.editPost(data);

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    revalidatePath(`/posts/${data.slug}`);
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
