"use client";

import { ErrorCode, SignupData } from "@/types";
import { useMemo, useState } from "react";
import { isUserExistsAction, loginAction, signupAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsChevronRight } from "@/components/icons/reactIcons";
import { useRouter, useSearchParams } from "next/navigation";
import constants from "@/constants/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { ErrorMessage } from "@/components/ui/error-message";

type FormType = "login" | "signup";

export const Form = () => {
  const {
    updateFormType,
    formData,
    formType,
    loading,
    error,
    onChange,
    onSubmit,
  } = useFormEmail();
  const { formText } = useFormText({ formType });

  return (
    <>
      <h1 className="text-center text-xl font-semibold">{formText.title}</h1>
      {error && <ErrorMessage error={error} />}
      {!!formType && (
        <button
          className="absolute top-2 right-4"
          onClick={() => updateFormType(undefined)}
        >
          <BsChevronRight />
        </button>
      )}
      {formType === "login" && formData.name && (
        <p className="text-center whitespace-pre-line">اهلا {formData.name}</p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {formType !== "login" && (
          <Input
            disabled={loading}
            required
            name="email"
            type="email"
            inputMode="email"
            enterKeyHint="next"
            placeholder="nlp@ml.com"
            value={formData.email}
            onChange={onChange}
          />
        )}

        {formType === "signup" && (
          <Input
            disabled={loading}
            required
            name="name"
            type="text"
            inputMode="text"
            enterKeyHint="next"
            placeholder="محمد أحمد"
            value={formData.name}
            onChange={onChange}
          />
        )}

        {!!formType && (
          <Input
            disabled={loading}
            required
            name="password"
            type="password"
            inputMode="text"
            enterKeyHint="go"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={onChange}
          />
        )}

        <Button disabled={loading}>
          {loading && <LoadingSpinner />} {formText.submit}
        </Button>
        {formType === "login" && (
          <div className="pt-4 text-center ">
            <Link href="/forgot-password" className="text-sm underline">
              نسيت كلمة المرور؟{" "}
            </Link>
          </div>
        )}
      </form>
    </>
  );
};

const useFormText = ({ formType }: { formType?: FormType }) => {
  const formText = useMemo(() => {
    switch (formType) {
      case "login":
        return {
          title: "تسجيل الدخول",
          submit: "دخول",
        };
      case "signup":
        return {
          title: "التسجيل",
          submit: "تسجيل",
        };
      default:
        return {
          title: "التسجيل أو تسجيل الدخول",
          submit: "التالي",
        };
    }
  }, [formType]);

  return { formText };
};

const defaultFormData = {
  name: "",
  email: "",
  password: "",
};

const useFormEmail = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [formType, setFormType] = useState<FormType>();
  const searchParams = useSearchParams();

  const updateFormType = (type?: FormType) => {
    setFormType(type);
    setError(undefined);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value.length > 100) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onEmailSubmit = async () => {
    setError(undefined);
    // remove previous info
    setFormData({ ...defaultFormData, email: formData.email });
    try {
      setLoading(true);
      const { data, errorCode } = await isUserExistsAction({
        email: formData.email,
      });

      setLoading(false);
      if (errorCode || !data) {
        return setError(errorCode ?? "internal_server_error");
      }

      if (data.exists) {
        setFormType("login");
        setFormData({ ...formData, name: data.name ?? "" });
      } else {
        setFormType("signup");
      }
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onLoginSubmit = async () => {
    setError(undefined);
    try {
      setLoading(true);
      const { errorCode } = await loginAction(formData);

      if (errorCode) {
        setLoading(false);
        setError(errorCode);
        return;
      }

      router.replace(
        searchParams.get("returnUrl") || constants.redirectAfterLoginPath
      );
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onSignupSubmit = async () => {
    setError(undefined);
    try {
      setLoading(true);
      const { errorCode } = await signupAction(formData);

      if (errorCode) {
        setLoading(false);
        setError(errorCode);
        return;
      }

      router.replace(
        searchParams.get("returnUrl") || constants.redirectAfterLoginPath
      );
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (formType) {
      case "login":
        onLoginSubmit();
        break;
      case "signup":
        onSignupSubmit();
        break;
      default:
        onEmailSubmit();
        break;
    }
  };

  return {
    formData,
    loading,
    error,
    onChange,
    onSubmit,
    formType,
    updateFormType,
  };
};
