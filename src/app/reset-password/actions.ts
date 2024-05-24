"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { verifyToken } from "@/lib/jwt";
import { hashPassword } from "@/lib/passwordEncryption";
import * as usersRepo from "@/repos/users";

export const resetPasswordAction = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) =>
  asyncHandler(async () => {
    let email: string;
    try {
      email = verifyToken<{ email: string }>({ token }).email;
    } catch (error) {
      return { errorCode: "invalid_reset_password_token" };
    }

    const user = await usersRepo.getUser({ type: "email", value: email });

    if (!user || !user.resetPasswordToken) {
      return { errorCode: "invalid_reset_password_token" };
    }

    if (password.length < 6) {
      return { errorCode: "invalid_password" };
    }

    const hashedPassword = await hashPassword({ password });
    const { success } = await usersRepo.updateUserPassword({
      userId: user.id,
      password: hashedPassword,
    });

    if (!success) {
      return { errorCode: "internal_server_error" };
    }

    return {};
  });
