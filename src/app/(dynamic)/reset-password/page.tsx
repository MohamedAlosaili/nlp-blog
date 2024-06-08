import { Suspense } from "react";
import { Form } from "./Form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const dynamic = "force-dynamic";

const ResetPasswordPage = async () => {
  return (
    <main className="page-style items-center justify-center">
      <section className="p-4 border w-full max-w-md border-zinc-400 rounded-xl space-y-4 relative">
        <h1 className="text-center text-xl font-semibold">
          إعادة تعيين كلمة المرور
        </h1>
        <Suspense fallback={<LoadingSpinner />}>
          <Form />
        </Suspense>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
