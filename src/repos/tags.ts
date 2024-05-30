import { client } from "@/lib/db";
import { RepoReturn, Tag } from "@/types";

export const getTags = async () => {
  const tags = await client.execute("SELECT * FROM tags");
  return tags.rows as unknown as Tag[];
};

export const createTag = async ({
  name,
}: {
  name: string;
}): Promise<RepoReturn<{ tag: Tag }>> => {
  const { lastInsertRowid } = await client.execute({
    sql: "INSERT INTO tags (name) VALUES (?)",
    args: [name],
  });

  if (!lastInsertRowid) {
    return { errorCode: "internal_server_error" };
  }

  return {
    data: {
      tag: {
        id: parseInt(lastInsertRowid.toString()),
        name,
      },
    },
  };
};
