import { ErrorMessage } from "@/components/ui/error-message";
import { getPostComments } from "@/repos/comments";
import { getPost } from "@/repos/posts";
import { IComment } from "@/types";
import { getPostImage } from "@/utils/images";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CommentForm, SharePost } from "./components";
import { timeSince } from "@/utils/timeSince";
import { formatDate } from "@/utils/formatDate";
import { AvatarFallback } from "@/components/ui/avatar";
import { Metadata } from "next";
import { generalMetadata } from "@/constants/server";

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const { data } = await getPost({
    postId: parseInt(params.postId),
    onlyPublished: true,
  });

  if (!data?.post) {
    return generalMetadata;
  }

  return {
    ...generalMetadata,
    title: data?.post.title,
    description: data?.post.summary,
    twitter: {
      ...generalMetadata.twitter,
      title: data?.post.title,
      description: data?.post.summary,
      images: [getPostImage(data.post.coverImage)],
    },
    openGraph: {
      ...generalMetadata.openGraph,
      title: data?.post.title,
      description: data?.post.summary,
      images: [getPostImage(data.post.coverImage)],
    },
  };
};

interface PostProps {
  params: { postId: string };
}

const Post = async ({ params }: PostProps) => {
  const { data, errorCode } = await getPost({
    postId: parseInt(params.postId),
    onlyPublished: true,
  });
  const post = data?.post;

  if (errorCode === "post_not_found") {
    notFound();
  }

  if (errorCode || !post) {
    return (
      <ErrorMessage
        className="page-style justify-center text-xl"
        error="internal_server_error"
      />
    );
  }

  return (
    <main className="page-style flex-col">
      <div>
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl ">
          <h1>{post.title}</h1>
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-center gap-4 justify-between">
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <time>{formatDate(post.createdAt)}</time>
                {post.updatedAt && (
                  <p>
                    - آخر تحديث: <time>{formatDate(post.updatedAt)}</time>
                  </p>
                )}
              </div>
              <SharePost />
            </div>
          </div>
          <p>{post.summary}</p>
          <Image
            src={getPostImage(post.coverImage)}
            alt={post.title}
            width={800}
            height={400}
            className="w-full max-w-xl mx-auto"
          />

          <div
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>
        <Suspense fallback={<p>تحميل...</p>}>
          <Comments postId={post.id} />
        </Suspense>
      </div>
    </main>
  );
};

const Comments = async ({ postId }: { postId: number }) => {
  const getComments = unstable_cache(
    async ({ postId }: { postId: number }) => {
      const { data } = await getPostComments({ postId });

      return data?.comments ?? [];
    },
    [`post_${postId}_comments`],
    { tags: [`post_${postId}_comments`] }
  );
  const comments = await getComments({ postId });

  return (
    <div className="mt-20 pt-10 border-t-2 border-zinc-300">
      <h3 className="text-2xl font-semi-bold mb-4 text-center">اترك تعليقك</h3>
      <CommentForm />
      <div className="py-8">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

const Comment = ({ comment }: { comment: IComment }) => {
  return (
    <div className="border-b-2 last:border-b-0 border-zinc-300 p-6 shadow-md rounded-md">
      <div className="flex items-center gap-2">
        <AvatarFallback alt={comment.senderName} className="h-8 w-8" />
        <p>{comment.senderName}</p>
      </div>
      <p className="whitespace-pre-wrap mt-4 text-lg" dir="auto">
        {comment.content}
      </p>
      <div className="text-left mt-2">
        <time className="text-sm text-zinc-600">
          {timeSince(comment.createdAt)}
        </time>
      </div>
    </div>
  );
};

export default Post;
