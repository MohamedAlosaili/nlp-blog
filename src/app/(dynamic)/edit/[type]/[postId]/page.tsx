import { PostForm } from "@/components/forms/PostForm";
import { NotVerifiedUser } from "@/components/ui/NotVerifiedUser";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { redirect } from "next/navigation";
import * as postsRepo from "@/repos/posts";
import * as draftsRepo from "@/repos/drafts";
import * as tagsRepo from "@/repos/tags";
import * as postTagsRepo from "@/repos/postTags";
import { Tag } from "@/types";

interface EditPostProps {
  params: { type: "posts" | "drafts"; postId: string };
}

export const dynamic = "force-dynamic";

const EditPost = async ({ params: { type, postId } }: EditPostProps) => {
  let postRequest: ReturnType<
    typeof draftsRepo.getDraft | typeof postsRepo.getPost
  >;
  if (type === "drafts") {
    postRequest = draftsRepo.getDraft({
      draftId: parseInt(postId ?? ""),
    });
  } else {
    postRequest = postsRepo.getPost({ postId: parseInt(postId ?? "") });
  }

  let tagsRequest: Promise<Tag[]>;
  if (type === "drafts") {
    tagsRequest = tagsRepo.getTags();
  } else {
    tagsRequest = postTagsRepo
      .getPostTags({ postId: parseInt(postId ?? "") })
      .then(res => res.data?.tags ?? []);
  }

  let [user, post, tags] = await Promise.all([
    getCurrentUser(),
    postRequest,
    tagsRequest,
  ]);

  if (!user) {
    redirect("/login?returnUrl=/posts/create");
  }

  if (user.verified === 0) {
    return <NotVerifiedUser />;
  }

  const _post =
    post.data && "post" in post.data ? post.data.post : post.data?.draft;

  if (user.id !== _post?.userId) {
    redirect("/posts/my");
  }

  if (!_post) {
    return <div>المقال غير موجود</div>;
  }

  if (type === "drafts" && "tags" in _post) {
    const draftTags = _post.tags.split(",").map(Number);
    tags = tags.filter(tag => draftTags.includes(tag.id));
  }

  let isPublished = false;
  if ("isPublished" in _post) {
    isPublished = _post.isPublished;
  }

  return (
    <main className="page-style">
      <section className="w-full flex flex-col gap-8">
        <h1 className="text-center text-2xl text-center font-semibold">
          تعديل المقال
        </h1>
        <PostForm
          initialFormData={{
            title: _post.title,
            summary: _post.summary,
            coverImage: _post.coverImage,
            content: _post.content,
            isPublished,
            tags,
          }}
        />
      </section>
    </main>
  );
};

export default EditPost;
