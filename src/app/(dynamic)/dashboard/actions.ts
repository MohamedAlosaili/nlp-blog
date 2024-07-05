"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import * as userRepo from "@/repos/users";
import * as postRepo from "@/repos/posts";
import { ErrorCode } from "@/types";
import { revalidatePath } from "next/cache";

interface ChangeUserStateActionParams {
  userId: number;
  action: "delete" | "unDelete" | "verify" | "unVerify";
}

export const changeUserStateAction = ({
  userId,
  action,
}: ChangeUserStateActionParams) =>
  asyncHandler(async () => {
    const user = await getCurrentUser();
    if (!user || user?.role !== "admin") {
      return { errorCode: "internal_server_error" };
    }

    let errorCode: ErrorCode | undefined;

    switch (action) {
      case "delete":
        errorCode = (await userRepo.deleteUser({ userId })).errorCode;
        break;
      case "unDelete":
        errorCode = (await userRepo.unDeleteUser({ userId })).errorCode;
        break;
      case "verify":
        errorCode = (await userRepo.verifyUser({ userId })).errorCode;
        break;
      case "unVerify":
        errorCode = (await userRepo.unVerifyUser({ userId })).errorCode;
        break;
    }

    if (errorCode) {
      return { errorCode };
    }

    return {};
  });

interface ChangePostStateActionParams {
  postId: number;
  action: "delete" | "unDelete" | "publish" | "unPublish";
}

export const changePostStateAction = ({
  postId,
  action,
}: ChangePostStateActionParams) =>
  asyncHandler(async () => {
    const [user, postResult] = await Promise.all([
      getCurrentUser(),
      postRepo.getPostRecord({ postId }),
    ]);
    if (!user || user?.role !== "admin") {
      return { errorCode: "internal_server_error" };
    }

    let errorCode: ErrorCode | undefined;

    switch (action) {
      case "delete":
        errorCode = (await postRepo.deletePost({ postId })).errorCode;
        break;
      case "unDelete":
        errorCode = (await postRepo.unDeletePost({ postId })).errorCode;
        break;
      case "publish":
        errorCode = (await postRepo.publishPost({ postId })).errorCode;
        break;
      case "unPublish":
        errorCode = (await postRepo.unPublishPost({ postId })).errorCode;
        break;
    }

    if (errorCode) {
      return { errorCode };
    }

    revalidatePath("/");
    revalidatePath(`/posts/${postResult.data?.post.slug}`);

    return {};
  });
