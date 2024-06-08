"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { EditDraftData, EditPostData } from "@/types";
import * as postsRepo from "@/repos/posts";
import * as postTagsRepo from "@/repos/postTags";
import * as draftsRepo from "@/repos/drafts";
import { revalidatePath } from "next/cache";

export const editPostAction = async (data: EditPostData) =>
  asyncHandler(async () => {
    const postTags = await postTagsRepo.getPostTags({ postId: data.id });
    const isTagsChanged =
      postTags.data?.tags
        .map(tag => tag.id)
        .sort()
        .toString() !== data.tags.sort().toString();

    let updatePostTagsRequests: Promise<any>[] = [];
    if (isTagsChanged) {
      updatePostTagsRequests.push(
        postTagsRepo.deletePostTags({ postId: data.id })
      );
      updatePostTagsRequests.push(
        ...data.tags.map(tag =>
          postTagsRepo.addPostTag({ postId: data.id, tagId: tag.id })
        )
      );
    }

    const updatePostRequest = postsRepo.editPost(data);
    await Promise.all([updatePostRequest, ...updatePostTagsRequests]);

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
