import { client } from "@/lib/db";
import {
  CreateUserData,
  GetUserData,
  IUser,
  RepoMutationReturn,
  UpdatePasswordData,
  UpdatePhotoData,
  UpdateResetPasswordTokenData,
  UpdateUserInfoData,
} from "@/types";

/*
    🔴 Validation should happen before call these functions
*/

export const getUser = async ({ type, value }: GetUserData) => {
  let sql: string;

  if (type === "id") {
    sql = "SELECT * FROM users WHERE id = ? AND isDeleted = 0";
  } else {
    sql = "SELECT * FROM users WHERE email = ? AND isDeleted = 0";
  }

  const { rows } = await client.execute({
    sql,
    args: [value],
  });

  if (rows.length === 0) {
    return;
  }

  const user = rows[0];

  return user as unknown as IUser;
};

export const createUser = async ({ name, email, password }: CreateUserData) => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    args: [name, email, password],
  });

  return lastInsertRowid?.toString() ?? "";
};

export const updateResetPasswordToken = async ({
  email,
  token,
}: UpdateResetPasswordTokenData): Promise<RepoMutationReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET resetPasswordToken = ? WHERE email = ?",
    args: [token, email],
  });

  return { success: rowsAffected > 0 };
};

export const updateUserPassword = async ({
  userId,
  password,
}: UpdatePasswordData) => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET password = ? WHERE id = ?",
    args: [password, userId],
  });

  return { success: rowsAffected > 0 };
};

export const updateUserInfo = async ({
  userId,
  name,
  phone,
}: UpdateUserInfoData) => {
  if (!name && !phone) {
    return { success: true };
  }

  if (name && phone) {
    const { rowsAffected } = await client.execute({
      sql: "UPDATE users SET name = ?, phone = ? WHERE id = ?",
      args: [name, phone, userId],
    });

    return { success: rowsAffected > 0 };
  } else if (name) {
    const { rowsAffected } = await client.execute({
      sql: "UPDATE users SET name = ? WHERE id = ?",
      args: [name, userId],
    });

    return { success: rowsAffected > 0 };
  } else if (phone) {
    const { rowsAffected } = await client.execute({
      sql: "UPDATE users SET phone = ? WHERE id = ?",
      args: [phone, userId],
    });

    return { success: rowsAffected > 0 };
  }

  return { success: false };
};

export const updatePhoto = async ({ userId, photo }: UpdatePhotoData) => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET photo = ? WHERE id = ?",
    args: [photo, userId],
  });

  return { success: rowsAffected > 0 };
};
