import { PostForm } from "./PostForm";

export const dynamic = "force-dynamic";

const CreatePost = () => {
  return (
    <main className="page-style">
      <section className="w-full flex flex-col gap-8">
        <h1 className="text-center text-2xl text-center font-semibold">
          إنشاء مقال جديد
        </h1>
        <PostForm />
      </section>
    </main>
  );
};

export default CreatePost;
