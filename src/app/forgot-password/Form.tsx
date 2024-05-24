"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorCode } from "@/types";
import { useState } from "react";
import { forgotPasswordAction } from "./actions";
import { ErrorMessage } from "@/components/ui/error-message";

export const Form = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState<ErrorCode>();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      setLoading(true);
      const { errorCode } = await forgotPasswordAction(formData);
      setLoading(false);
      if (errorCode) {
        setError(errorCode);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  if (success) {
    return (
      <p className="text-center text-sm text-green-600">
        تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <ErrorMessage error={error} />}
      <Input
        required
        disabled={loading}
        name="email"
        type="email"
        inputMode="email"
        enterKeyHint="next"
        placeholder="البريد الإلكتروني"
        value={formData.email}
        onChange={e => setFormData({ email: e.target.value })}
      />
      <Button disabled={loading}>{loading && <LoadingSpinner />} إرسال</Button>
    </form>
  );
};
