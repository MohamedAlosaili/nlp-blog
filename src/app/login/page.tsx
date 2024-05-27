import { Suspense } from "react";
import { Form } from "./Form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const LoginPage = async () => {
  return (
    <main className="page-style items-center justify-center">
      <section className="p-4 border w-full max-w-md border-zinc-400 rounded-xl space-y-4 relative">
        <Suspense fallback={<LoadingSpinner />}>
          <Form />
        </Suspense>
      </section>
    </main>
  );
};

export default LoginPage;
