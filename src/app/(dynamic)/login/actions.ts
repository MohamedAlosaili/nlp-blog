"use server";

import { asyncHandler } from "@/helpers/asyncHandler";
import { comparePassword, hashPassword } from "@/lib/passwordEncryption";
import { LoginData, SignupData } from "@/types";
import { isEmailValid } from "@/utils/validateEmail";
import { generateToken } from "@/lib/jwt";
import { setCookie } from "@/lib/cookies";
import * as usersRepo from "@/repos/users";

export const isUserExistsAction = ({ email }: { email: string }) =>
  asyncHandler(async () => {
    if (!email.trim()) {
      return { errorCode: "email_required" };
    }

    const user = await usersRepo.getUser({ type: "email", value: email });

    return {
      data: {
        exists: !!user,
        name: user?.name ?? "",
      },
    };
  });

export const loginAction = (data: Partial<LoginData>) =>
  asyncHandler(async () => {
    const { email, password } = data;

    if (!email?.trim()) {
      return { errorCode: "email_required" };
    }

    if (!password) {
      return { errorCode: "password_required" };
    }

    const user = await usersRepo.getUser({
      type: "email",
      value: email.trim().toLowerCase(),
    });

    if (!user || !user.password) {
      return { errorCode: "invalid_email" };
    }

    if (
      !(await comparePassword({
        password,
        hashedPassword: user.password,
      }))
    ) {
      return { errorCode: "wrong_password" };
    }

    const token = generateToken({ id: user.id });
    setCookie({ name: "session", value: token });

    return {};
  });

export const signupAction = (data: Partial<SignupData>) =>
  asyncHandler(async () => {
    const { name, email, password } = data;

    if (!name?.trim()) {
      return { errorCode: "name_required" };
    } else if (!email || !isEmailValid(email)) {
      return { errorCode: email?.trim() ? "invalid_email" : "email_required" };
    } else if (!password || password.length < 6) {
      return { errorCode: password ? "invalid_password" : "password_required" };
    }

    const userExists = await usersRepo.getUser({ type: "email", value: email });

    if (!!userExists) {
      return { errorCode: "duplicate_email" };
    }

    const nameTr = name.trim();
    const emailLc = email.trim().toLowerCase();
    const hashedPassword = await hashPassword({ password });

    const id = await usersRepo.createUser({
      name: nameTr,
      email: emailLc,
      password: hashedPassword,
    });

    if (!id) {
      return { errorCode: "internal_server_error" };
    }

    const token = generateToken({ id });
    setCookie({ name: "session", value: token });
    return {};
  });
