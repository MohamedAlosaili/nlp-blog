import { generalMetadata } from "@/constants/server";
import { getPublishedPosts } from "@/repos/posts";
import { formatDate } from "@/utils/formatDate";
import { getPostImage } from "@/utils/images";
import { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { data } = await getPublishedPosts();

  const posts = data?.posts;

  return (
    <main className="page-style">
      <div className="w-full">
        <div className="mb-20 space-y-8">
          <h1 className="text-center text-2xl font-bold">المقالات</h1>

          <div>
            {posts?.map(post => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row items-center gap-4 border-b-2 border-zinc-300/60 pb-8 mb-8"
              >
                <Link href={`/posts/${post.id}`}>
                  <Image
                    src={getPostImage(post.coverImage)}
                    alt={post.title}
                    width={208}
                    height={112}
                    className="shrink-0 sm:w-52 sm:h-28 w-full aspect-video  rounded-md object-cover"
                  />
                </Link>
                <div className="w-full flex-1 flex flex-col-reverse sm:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">
                      <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm">{post.summary}</p>
                    <p className="text-sm mt-4">
                      {formatDate(post.createdAt)}{" "}
                      {"updatedAt" in post && post.updatedAt
                        ? `- تم التحديث بتاريخ ${formatDate(post.updatedAt)}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
