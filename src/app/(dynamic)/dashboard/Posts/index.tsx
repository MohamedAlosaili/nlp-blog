import * as postRepo from "@/repos/posts";
import { IDashboardPost } from "@/types";
import { PostStatusButtons } from "./PostStatusButtons";

export const Posts = async () => {
  const posts = await postRepo.getAllPosts();

  if (posts.length === 0) {
    return <div>لا يوجد مقالات</div>;
  }
  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const Post = ({ post }: { post: IDashboardPost }) => {
  return (
    <div
      key={post.id}
      className="flex flex-col gap-4 border-b-2 border-slate-200/80 py-4"
    >
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm">{post.summary}</p>
      </div>
      <PostStatusButtons post={post} />
    </div>
  );
};
