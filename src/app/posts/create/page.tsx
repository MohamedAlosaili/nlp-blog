import { getCurrentUser } from "@/helpers/getCurrentUser";
import { PostForm } from "@/components/forms/PostForm";
import { redirect } from "next/navigation";
import { NotVerifiedUser } from "@/components/ui/NotVerifiedUser";
import { Menu } from "../../../components/layout/menu";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مقال جديد",
};

const CreatePost = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/posts/create");
  }

  if (user.verified === 0) {
    return <NotVerifiedUser />;
  }

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
