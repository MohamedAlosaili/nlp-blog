import { Form } from "./Form";

export const dynamic = "force-dynamic";

const ForgotPasswordPage = async () => {
  return (
    <main className="page-style items-center justify-center">
      <section className="p-4 border w-full max-w-md border-zinc-400 rounded-xl space-y-4 relative">
        <h1 className="text-center text-xl font-semibold">
          استعادة كلمة المرور
        </h1>
        <Form />
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
