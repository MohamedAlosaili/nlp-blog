"use server";

import constants from "@/constants/server";
import { asyncHandler } from "@/helpers/asyncHandler";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import * as usersRepo from "@/repos/users";
import { uploadFile } from "@/services/upload";
import { revalidatePath } from "next/cache";

export const updateProfileImageAction = (formData: FormData) =>
  asyncHandler(async () => {
    const userId = getIdFromToken();
    if (!userId) {
      return { errorCode: "internal_server_error" };
    }

    const photo = formData.get("photo") as File;
    const filename = `${userId}.png`;
    const filepath = `${constants.profilePhotoStoragePath}/${filename}`;

    const [result, success] = await Promise.all([
      uploadFile(photo, filepath),
      usersRepo.updatePhoto({
        userId,
        photo: filename,
      }),
    ]);

    if (!success) {
      return { errorCode: "internal_server_error" };
    }

    revalidatePath("/profile/edit");
    return result;
  });

export const updateUserInfoAction = (data: { name?: string; phone?: string }) =>
  asyncHandler(async () => {
    const { name, phone } = data;

    const userId = getIdFromToken();
    if (!userId) {
      return { errorCode: "internal_server_error" };
    }

    const nameTr = name?.trim();
    const phoneTr = phone?.trim();
    const { success } = await usersRepo.updateUserInfo({
      userId,
      name: nameTr,
      phone: phoneTr,
    });

    if (!success) {
      return { errorCode: "internal_server_error" };
    }

    revalidatePath("/profile/edit");
    return {};
  });
