import { Form } from "./Form";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { redirect } from "next/navigation";

export const invalidate = 5 * 60;

const EditProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/profile/edit");
  }

  return (
    <main className="page-style items-center justify-center">
      <section className="p-4 border w-full max-w-md border-zinc-400 rounded-xl space-y-4 relative">
        <h1 className="text-center text-xl font-semibold">الملف الشخصي</h1>
        <Form user={user} />
      </section>
    </main>
  );
};

export default EditProfilePage;
