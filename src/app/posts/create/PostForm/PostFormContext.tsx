"use client";

import { createContext } from "react";
import { defaultFormData, usePostForm } from "./usePostForm";

export const PostFormContext = createContext<ReturnType<typeof usePostForm>>({
  formData: defaultFormData,
  loading: false,
  error: undefined,
  onChange: () => {},
  onSubmit: async () => {},
});

export const PostFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = usePostForm();

  return (
    <PostFormContext.Provider value={form}>{children}</PostFormContext.Provider>
  );
};
