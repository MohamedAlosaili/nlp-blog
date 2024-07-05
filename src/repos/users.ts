import { client } from "@/lib/db";
import {
  CreateUserData,
  GetUserData,
  IDashboardUser,
  IUser,
  RepoReturn,
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

  const { id, ...user } = rows[0] as unknown as IUser;

  return { ...user, id: parseInt(id.toString()) };
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
}: UpdateResetPasswordTokenData): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET resetPasswordToken = ? WHERE email = ?",
    args: [token, email],
  });

  return {
    errorCode: rowsAffected === 0 ? "internal_server_error" : undefined,
  };
};

export const updateUserPassword = async ({
  userId,
  password,
}: UpdatePasswordData): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET password = ? WHERE id = ?",
    args: [password, userId],
  });

  return {
    errorCode: rowsAffected === 0 ? "internal_server_error" : undefined,
  };
};

export const updateUserInfo = async ({
  userId,
  name,
  phone,
}: UpdateUserInfoData): Promise<RepoReturn> => {
  if (!name && !phone) {
    return {};
  }

  let rowsAffected = 0;
  if (name && phone) {
    const result = await client.execute({
      sql: "UPDATE users SET name = ?, phone = ? WHERE id = ?",
      args: [name, phone, userId],
    });

    rowsAffected = result.rowsAffected;
  } else if (name) {
    const result = await client.execute({
      sql: "UPDATE users SET name = ? WHERE id = ?",
      args: [name, userId],
    });

    rowsAffected = result.rowsAffected;
  } else if (phone) {
    const result = await client.execute({
      sql: "UPDATE users SET phone = ? WHERE id = ?",
      args: [phone, userId],
    });

    rowsAffected = result.rowsAffected;
  }

  return {
    errorCode: rowsAffected === 0 ? "internal_server_error" : undefined,
  };
};

export const updatePhoto = async ({ userId, photo }: UpdatePhotoData) => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET photo = ? WHERE id = ?",
    args: [photo, userId],
  });

  return { success: rowsAffected > 0 };
};

export const getAllUsers = async ({
  currentUserId,
}: {
  currentUserId: number;
}) => {
  const { rows } = await client.execute({
    sql: "SELECT id, name, email, photo, verified, isDeleted FROM users WHERE id != ? ORDER BY createdAt DESC",
    args: [currentUserId],
  });

  return (rows as unknown as IDashboardUser[]).map(user => ({
    ...user,
    id: parseInt(user.id.toString()),
  }));
};

export const deleteUser = async ({
  userId,
}: {
  userId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET isDeleted=1 WHERE id = ?",
    args: [userId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const unDeleteUser = async ({
  userId,
}: {
  userId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET isDeleted=0 WHERE id = ?",
    args: [userId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const verifyUser = async ({
  userId,
}: {
  userId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET verified=1 WHERE id = ?",
    args: [userId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const unVerifyUser = async ({
  userId,
}: {
  userId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE users SET verified=0 WHERE id = ?",
    args: [userId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};
