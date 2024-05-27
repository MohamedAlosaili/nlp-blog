"use server";

import constants from "@/constants/server";
import { asyncHandler } from "@/helpers/asyncHandler";
import { randomId } from "@/lib/randomId";
import { deleteFile, uploadFile } from "@/services/upload";
import { PostFormData, Tag } from "@/types";
import * as tagsRepo from "@/repos/tags";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import * as draftsRepo from "@/repos/drafts";
import * as postsRepo from "@/repos/posts";
import * as postTasRepo from "@/repos/postTags";

export const uploadImageAction = async ({ formData }: { formData: FormData }) =>
  asyncHandler(async () => {
    const photo = formData.get("image") as File;

    const filename = `${randomId()}.webp`;
    const filepath = `${constants.postPhotoStoragePath}/${filename}`;
    await uploadFile(photo, filepath);

    return { data: { filename } };
  });

export const deleteImageAction = (filename: string) =>
  asyncHandler(async () => {
    await deleteFile(`${constants.postPhotoStoragePath}/${filename}`);

    return {};
  });

export const createTagAction = ({ name }: { name: string }) =>
  asyncHandler<{ tag: Tag }>(async () => {
    const { data, errorCode } = await tagsRepo.createTag({ name: name.trim() });

    if (errorCode) {
      return { errorCode };
    }

    return { data };
  });

export const saveDraftPostAction = ({ formData }: { formData: PostFormData }) =>
  asyncHandler(async () => {
    const { title, summary, coverImage, tags, content } = formData;
    const userId = getIdFromToken();
    if (!userId) return { errorCode: "internal_server_error" };

    const stringifiedTags = tags.map(tag => tag.id).join(",");

    const { data, errorCode } = await draftsRepo.createNewDraft({
      title,
      summary,
      coverImage,
      tags: stringifiedTags,
      content,
      userId,
    });

    if (errorCode || !data) {
      return { errorCode };
    }

    return { data };
  });

export const publishPostAction = ({ formData }: { formData: PostFormData }) =>
  asyncHandler(async () => {
    const { title, summary, coverImage, tags, content } = formData;
    const userId = getIdFromToken();
    if (!userId) return { errorCode: "internal_server_error" };

    let { data, errorCode } = await postsRepo.createNewPost({
      title,
      summary,
      coverImage,
      content,
      userId,
    });

    if (errorCode) {
      return { errorCode };
    }

    const postTags = tags.map(tag =>
      postTasRepo.addPostTag({ postId: data.post.id, tagId: tag.id })
    );

    const result = await Promise.all(postTags);

    errorCode = result.find(r => r.errorCode)?.errorCode;
    if (errorCode) {
      return { errorCode };
    }

    return { data };
  });
