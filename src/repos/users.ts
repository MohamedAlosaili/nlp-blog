import { client } from "@/lib/db";
import { CreateUserData, GetUserData, IUser } from "@/types";

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

  console.log("#### lastInsertRowid", lastInsertRowid, "####");

  return lastInsertRowid?.toString() ?? "";
};
