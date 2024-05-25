import { ErrorCode, PostFormData } from "@/types";
import { useState } from "react";

export const defaultFormData: PostFormData = {
  title: "",
  tags: [],
  summary: "",
  content: "",
};

export const usePostForm = () => {
  const [formData, setFormData] = useState<PostFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();

  const onChange = <T extends keyof PostFormData>({
    name,
    value,
  }: {
    name: T;
    value: PostFormData[T];
  }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(undefined);

    try {
      // await client.post("/posts", formData);
      setFormData(defaultFormData);
    } catch (error) {
      setError("internal_server_error");
    }

    setLoading(false);
  };

  return {
    formData,
    loading,
    error,
    onChange,
    onSubmit,
  };
};
