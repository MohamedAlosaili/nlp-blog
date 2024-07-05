import { client } from "@/lib/db";
import {
  EditPostData,
  IDashboardPost,
  IPost,
  NewPostData,
  RepoReturn,
} from "@/types";
import * as postTagsRepo from "./postTags";

export const createNewPost = async (data: NewPostData): Promise<RepoReturn> => {
  const transaction = await client.transaction();
  try {
    const { lastInsertRowid } = await transaction.execute({
      sql: "INSERT INTO posts (title, authorName, slug, summary, coverImage, content, userId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.title,
        data.authorName ?? null,
        data.slug,
        data.summary,
        data.coverImage,
        data.content,
        data.userId,
      ],
    });

    if (!lastInsertRowid) {
      throw new Error("internal_server_error");
    }

    const postId = parseInt(lastInsertRowid.toString());
    const postTags = data.tags.map(tag =>
      postTagsRepo.addPostTag({ postId, tagId: tag.id, transaction })
    );

    const result = await Promise.all(postTags);

    const failed = result.find(r => r.errorCode);
    if (failed) {
      throw new Error(failed.errorCode);
    }

    await transaction.commit();
    return {
      data: {
        post: {
          id: parseInt(lastInsertRowid.toString()),
          title: data.title,
          summary: data.summary,
          coverImage: data.coverImage,
          content: data.content,
          userId: data.userId,
        },
      },
    };
  } catch (error) {
    await transaction.rollback();
    return { errorCode: "internal_server_error" };
  }
};

export const getPublishedPosts = async (): Promise<
  RepoReturn<{ posts: IPost[] }>
> => {
  const { rows } = await client.execute(
    "SELECT * FROM posts WHERE isPublished = 1 AND isDeleted = 0 ORDER BY createdAt DESC"
  );

  return {
    data: {
      posts: (rows as unknown as IPost[]).map(post => ({
        ...post,
        id: parseInt(post.id.toString()),
      })),
    },
  };
};
export const getUserPublishedPosts = async (
  userId: number
): Promise<RepoReturn<{ posts: IPost[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM posts WHERE userId = ? AND isPublished = 1 AND isDeleted = 0 ORDER BY createdAt DESC",
    args: [userId],
  });

  return {
    data: {
      posts: (rows as unknown as IPost[]).map(post => ({
        ...post,
        id: parseInt(post.id.toString()),
      })),
    },
  };
};

export const getUserUnPublishedPosts = async (
  userId: number
): Promise<RepoReturn<{ posts: IPost[] }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM posts WHERE userId = ? AND isPublished = 0 AND isDeleted = 0 ORDER BY createdAt DESC",
    args: [userId],
  });

  return {
    data: {
      posts: (rows as unknown as IPost[]).map(post => ({
        ...post,
        id: parseInt(post.id.toString()),
      })),
    },
  };
};

export const deletePost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET isDeleted = 1 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const unDeletePost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET isDeleted = 0 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const publishPost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const transaction = await client.transaction();
  try {
    const { rows } = await transaction.execute({
      sql: "SELECT isPublished, updatedAt FROM Posts WHERE id = ?",
      args: [postId],
    });

    const post = rows[0] as unknown as IPost;

    if (!post.isPublished) {
      await transaction.execute({
        sql: "UPDATE posts SET isPublished=1, updatedAt = NULL, createdAt = CURRENT_TIMESTAMP WHERE id = ?",
        args: [postId],
      });
    }

    await transaction.commit();
    return {};
  } catch (error) {
    await transaction.rollback();
    return { errorCode: "internal_server_error" };
  }
};

export const unPublishPost = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn> => {
  const { rowsAffected } = await client.execute({
    sql: "UPDATE posts SET isPublished = 0 WHERE id = ?",
    args: [postId],
  });

  if (rowsAffected === 0) {
    return { errorCode: "internal_server_error" };
  }

  return {};
};

export const getPost = async ({
  postId,
  onlyPublished = false,
}: {
  postId: number;
  onlyPublished?: boolean;
}): Promise<RepoReturn<{ post: IPost }>> => {
  let sql = `
    SELECT (
      CASE
        WHEN (p.authorName IS NOT NULL) THEN p.authorName
        ELSE u.name
      END
      ) AS authorName,
      p.*
    FROM posts p
    INNER JOIN users u on p.userId = u.id
    WHERE p.id = ? AND p.isDeleted = 0`;

  if (onlyPublished) {
    sql += " AND isPublished = 1";
  }
  const { rows } = await client.execute({
    sql,
    args: [postId],
  });

  if (rows.length === 0) {
    return { errorCode: "post_not_found" };
  }

  const { id, ...post } = rows[0] as unknown as IPost;
  return {
    data: { post: { ...post, id: parseInt(id.toString()) } },
  };
};

export const getPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<RepoReturn<{ post: IPost }>> => {
  const { rows } = await client.execute({
    sql: `
    SELECT (
      CASE
        WHEN (p.authorName IS NOT NULL) THEN p.authorName
        ELSE u.name
      END
      ) AS authorName,
      p.*
    FROM posts p
    INNER JOIN users u on p.userId = u.id
    WHERE p.slug = ? AND isPublished = 1 AND p.isDeleted = 0`,
    args: [slug],
  });

  if (rows.length === 0) {
    return { errorCode: "post_not_found" };
  }

  const { id, ...post } = rows[0] as unknown as IPost;
  return {
    data: { post: { ...post, id: parseInt(id.toString()) } },
  };
};

export const editPost = async (data: EditPostData): Promise<RepoReturn> => {
  const transaction = await client.transaction();
  try {
    const postTags = await postTagsRepo.getPostTags({ postId: data.id });
    const originalTagsStringified = postTags.data?.tags
      .map(tag => tag.id)
      .sort((a, b) => a - b)
      .join(",");
    const currentTagsStringified = data.tags
      .map(tag => tag.id)
      .sort((a, b) => a - b)
      .join(",");
    const isTagsChanged = originalTagsStringified !== currentTagsStringified;

    let editPostRequests: Promise<any>[] = [];
    if (isTagsChanged) {
      await postTagsRepo.deletePostTags({ postId: data.id, transaction });
      editPostRequests.push(
        ...data.tags.map(tag =>
          postTagsRepo.addPostTag({
            postId: data.id,
            tagId: tag.id,
            transaction,
          })
        )
      );
    }

    const { rows } = await transaction.execute({
      sql: "SELECT isPublished FROM Posts WHERE id = ?",
      args: [data.id],
    });

    const post = rows[0] as unknown as IPost;

    if (!post.isPublished && data.isPublished) {
      editPostRequests.push(
        transaction.execute({
          sql: "UPDATE posts SET createdAt = CURRENT_TIMESTAMP WHERE id = ?",
          args: [data.id],
        })
      );
    }

    const [{ rowsAffected }] = await Promise.all([
      transaction.execute({
        sql: `
          UPDATE posts
          SET
            title = ?,
            authorName = ?,
            slug = ?,
            summary = ?,
            coverImage = ?,
            content = ?,
            isPublished = ?,
            updatedAt = CURRENT_TIMESTAMP
          WHERE
            id = ?
        `,
        args: [
          data.title,
          data.authorName ?? null,
          data.slug,
          data.summary,
          data.coverImage,
          data.content,
          data.isPublished ? 1 : 0,
          data.id,
        ],
      }),
      ...editPostRequests,
    ]);

    if (rowsAffected === 0) {
      throw new Error("internal_server_error");
    }

    await transaction.commit();
    return {};
  } catch (error) {
    await transaction.rollback();
    transaction.close();
    return { errorCode: "internal_server_error" };
  }
};

export const isSlugExists = async ({
  slug,
  postId,
}: {
  slug: string;
  postId?: number;
}) => {
  let isExists = false;

  if (postId) {
    const { rows } = await client.execute({
      sql: "SELECT slug FROM posts WHERE slug = ? AND id != ?",
      args: [slug, postId],
    });

    isExists = rows.length > 0;
  } else {
    const { rows } = await client.execute({
      sql: "SELECT slug FROM posts WHERE slug = ?",
      args: [slug],
    });

    isExists = rows.length > 0;
  }

  return isExists;
};

export const getAllPosts = async () => {
  const { rows } = await client.execute(
    "SELECT id, title, summary, authorName, coverImage, isPublished, isDeleted FROM posts ORDER BY createdAt DESC"
  );

  return (rows as unknown as IDashboardPost[]).map(post => ({
    ...post,
    id: parseInt(post.id.toString()),
  }));
};

export const getPostRecord = async ({
  postId,
}: {
  postId: number;
}): Promise<RepoReturn<{ post: IPost }>> => {
  const { rows } = await client.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [postId],
  });

  const { id, ...post } = rows[0] as unknown as IPost;
  return {
    data: { post: { ...post, id: parseInt(id.toString()) } },
  };
};
