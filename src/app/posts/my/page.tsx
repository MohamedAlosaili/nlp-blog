import { Suspense } from "react";
import { StickyNav } from "./StickNav";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { redirect } from "next/navigation";
import * as postsRepo from "@/repos/posts";
import * as draftsRepo from "@/repos/drafts";
import { ErrorMessage } from "@/components/ui/error-message";
import Link from "next/link";
import { Edit, Feather } from "lucide-react";
import Image from "next/image";
import { getPostImage } from "@/utils/images";
import { NotVerifiedUser } from "@/components/ui/NotVerifiedUser";
import { DeletePostButton, UnPublishPostButton } from "./buttons";
import { IDraft, IPost } from "@/types";

export const revalidate = 0;

const MyPosts = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/posts/my");
  }

  if (user.verified === 0) {
    return <NotVerifiedUser />;
  }

  return (
    <main className="page-style">
      <div className="space-y-8 w-full">
        <h1 className="text-center text-2xl font-bold">مقالاتي</h1>
        <StickyNav />
        <section className="min-h-60">
          <h2 id="published" className="text-xl font-bold mb-4">
            مقالات منشورة
          </h2>
          <Suspense fallback={<div>تحميل...</div>}>
            <PublishedPosts userId={user.id} />
          </Suspense>
        </section>

        <section className="min-h-60">
          <h2 id="unpublished" className="text-xl font-bold mb-4">
            مقالات غير منشورة
          </h2>
          <Suspense fallback={<div>تحميل...</div>}>
            <UnPublishedPosts userId={user.id} />
          </Suspense>
        </section>

        <section className="min-h-60">
          <h2 id="drafts" className="text-xl font-bold mb-4">
            مقالات مسودة
          </h2>
          <Suspense fallback={<div>تحميل...</div>}>
            <DraftPosts userId={user.id} />
          </Suspense>
        </section>

        <div className="fixed z-10 bottom-0 left-0 w-screen flex justify-center pointer-events-none">
          <div className="max-w-3xl w-full px-4 pb-8 pointer-events-none">
            <Link
              href="/posts/create"
              className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary"
            >
              <Feather />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

const PublishedPosts = async ({ userId }: { userId: number }) => {
  const { data } = await postsRepo.getUserPublishedPosts(userId);

  if (!data) {
    return <ErrorMessage error="internal_server_error" />;
  }

  if (data?.posts.length === 0) {
    return <div>لا توجد مقالات منشورة</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {data.posts.map(post => (
        <Card
          key={post.id}
          post={post}
          buttons={
            <>
              <Link href={`/edit/posts/${post.id}`}>
                <Edit />
              </Link>
              <UnPublishPostButton postId={post.id} />
              <DeletePostButton postId={post.id} postType="post" />
            </>
          }
        />
      ))}
    </div>
  );
};

const UnPublishedPosts = async ({ userId }: { userId: number }) => {
  const { data } = await postsRepo.getUserUnPublishedPosts(userId);

  if (!data) {
    return <ErrorMessage error="internal_server_error" />;
  }

  if (data?.posts.length === 0) {
    return <div>لا توجد مقالات غير منشورة</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {data.posts.map(post => (
        <Card
          key={post.id}
          post={post}
          buttons={
            <>
              <Link href={`/edit/posts/${post.id}`}>
                <Edit />
              </Link>
              <DeletePostButton postId={post.id} postType="post" />
            </>
          }
        />
      ))}
    </div>
  );
};

const DraftPosts = async ({ userId }: { userId: number }) => {
  const { data } = await draftsRepo.getUserDrafts(userId);

  if (!data) {
    return <ErrorMessage error="internal_server_error" />;
  }

  if (data?.drafts.length === 0) {
    return <div>لا توجد مسودات</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {data.drafts.map(post => (
        <Card
          key={post.id}
          post={post}
          buttons={
            <>
              <Link href={`/edit/drafts/${post.id}`}>
                <Edit />
              </Link>
              <DeletePostButton postId={post.id} postType="draft" />
            </>
          }
        />
      ))}
    </div>
  );
};

interface CardProps {
  post: IDraft | IPost;
  buttons?: React.ReactNode;
}

const Card = ({ post, buttons }: CardProps) => (
  <div key={post.id} className="flex items-center gap-4">
    <Image
      src={getPostImage(post.coverImage)}
      alt={post.title}
      width={208}
      height={112}
      className="shrink-0 w-52 h-28 rounded-md object-cover"
    />
    <div className="h-full flex flex-col gap-1">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-sm">{post.summary}</p>
      <p className="text-sm mt-4">
        {new Date(post.createdAt).toLocaleString("ar", {
          dateStyle: "long",
          numberingSystem: "mathsans",
        })}
      </p>
    </div>
    <div className="flex flex-col gap-2">{buttons}</div>
  </div>
);

export default MyPosts;
