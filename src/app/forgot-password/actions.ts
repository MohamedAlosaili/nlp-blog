"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { generateToken } from "@/lib/jwt";
import * as usersRepo from "@/repos/users";
import { sendResetPasswordEmail } from "@/services/sendEmail";

export const forgotPasswordAction = ({ email }: { email: string }) =>
  asyncHandler(async () => {
    // This is a fake function that simulates a request to the server
    // In a real application, this function should be replaced with a real API request

    const resetPasswordToken = generateToken({ email }, { expiresIn: "1h" });

    const { success } = await usersRepo.updateResetPasswordToken({
      email,
      token: resetPasswordToken,
    });

    if (success) {
      const url = `${process.env.CLIENT_URL}?token=${resetPasswordToken}`;
      await sendResetPasswordEmail({ email, url });
    }

    return {};
  });
