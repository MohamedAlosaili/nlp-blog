import { client } from "@/lib/db";
import { Tag } from "@/types";

export const getTags = async () => {
  const tags = await client.execute("SELECT * FROM tags");
  return tags.rows as unknown as Tag[];
};
