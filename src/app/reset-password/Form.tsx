"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorCode } from "@/types";
import { useState } from "react";
import { resetPasswordAction } from "./actions";
import { ErrorMessage } from "@/components/ui/error-message";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const Form = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<ErrorCode>();
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      if (!formData.password || !formData.confirmPassword) {
        return setError("password_required");
      }

      if (formData.password.length < 6) {
        return setError("invalid_password");
      }

      if (formData.password !== formData.confirmPassword) {
        return setError("passwords_not_match");
      }

      const token = searchParams.get("token") ?? "";
      if (!token) {
        return setError("invalid_reset_password_token");
      }

      setLoading(true);

      const { errorCode } = await resetPasswordAction({
        password: formData.password,
        token,
      });
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
        تم إعاة تعيين كلمة المرور بنجاح{" "}
        <Link href="/login" className="text-main font-semibold underline">
          تسجيل الدخول
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <ErrorMessage error={error} />}
      <Input
        required
        disabled={loading}
        name="password"
        type="password"
        inputMode="text"
        enterKeyHint="next"
        placeholder="كلمة المرور"
        value={formData.password}
        onChange={e =>
          setFormData(prev => ({ ...prev, password: e.target.value }))
        }
      />
      <Input
        required
        disabled={loading}
        name="confirmPassword"
        type="password"
        inputMode="text"
        enterKeyHint="next"
        placeholder="تأكيد كلمة المرور"
        value={formData.confirmPassword}
        onChange={e =>
          setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
        }
      />
      <Button disabled={loading}>
        {loading && <LoadingSpinner />} إعادة تعيين
      </Button>
    </form>
  );
};
