"use server";

import constants from "@/constants/server";
import { asyncHandler } from "@/helpers/asyncHandler";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import { bucket } from "@/lib/firebase";
import * as usersRepo from "@/repos/users";
import { ActionReturn } from "@/types";
import { revalidatePath } from "next/cache";

export const updateProfileImageAction = (formData: FormData) =>
  asyncHandler(async () => {
    const userId = getIdFromToken();
    if (!userId) {
      return { errorCode: "internal_server_error" };
    }

    const photo = formData.get("photo") as File;
    const arrayBuffer = await photo.arrayBuffer();

    const filename = `${userId}.png`;

    const file = bucket.file(
      `${constants.profilePhotoStoragePath}/${filename}`
    );
    const [result, success] = await Promise.all([
      new Promise<ActionReturn>(resolve => {
        file.save(
          Buffer.from(arrayBuffer),
          {
            gzip: true,
            metadata: {
              contentType: "image/png",
            },
          },
          err => {
            console.log(err);
            if (err) {
              resolve({ errorCode: "internal_server_error" });
            } else {
              resolve({});
            }
          }
        );
      }),
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
