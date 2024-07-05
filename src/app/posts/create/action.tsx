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
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";

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
    const { title, authorName, summary, coverImage, tags, content } = formData;
    const userId = getIdFromToken();
    if (!userId) return { errorCode: "internal_server_error" };

    const stringifiedTags = tags.map(tag => tag.id).join(",");

    const { data, errorCode } = await draftsRepo.createNewDraft({
      title,
      authorName,
      summary,
      coverImage,
      slug: slugify(formData.slug),
      tags: stringifiedTags,
      content,
      userId,
    });

    if (errorCode || !data) {
      return { errorCode };
    }

    revalidatePath("/posts/my");

    return { data };
  });

export const publishPostAction = ({ formData }: { formData: PostFormData }) =>
  asyncHandler(async () => {
    const { title, authorName, summary, coverImage, tags, content } = formData;
    const userId = getIdFromToken();
    if (!userId) return { errorCode: "internal_server_error" };

    if (!title.trim()) {
      return { errorCode: "title_required" };
    }

    if (!summary.trim()) {
      return { errorCode: "summary_required" };
    }

    if (!coverImage) {
      return { errorCode: "cover_image_required" };
    }

    if (tags.length === 0) {
      return { errorCode: "tags_required" };
    }

    if (content.length === 0) {
      return { errorCode: "content_required" };
    }

    if (!formData.slug || formData.slug.length < 3) {
      return { errorCode: !formData.slug ? "slug_required" : "slug_too_short" };
    }

    const slug = slugify(formData.slug);

    const isSlugExists = await postsRepo.isSlugExists({ slug });

    if (isSlugExists) {
      return { errorCode: "slug_duplicated" };
    }

    let { data, errorCode } = await postsRepo.createNewPost({
      title: title.trim(),
      authorName: authorName?.trim(),
      summary: summary.trim(),
      coverImage,
      content,
      slug,
      tags,
      userId,
    });

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/posts/my");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/`);
    return { data };
  });

export const checkSlugAction = ({
  slug,
  postId,
}: {
  slug: string;
  postId?: number;
}) =>
  asyncHandler(async () => {
    const slugifyed = slugify(slug);

    const isExists = await postsRepo.isSlugExists({ slug: slugifyed, postId });

    if (isExists) {
      return { errorCode: "slug_duplicated" };
    }

    return { data: { slug: slugifyed } };
  });
