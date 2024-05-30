"use client";

import { createContext } from "react";
import { usePostForm } from "./usePostForm";
import { PostFormData, PostType } from "@/types";
import constants from "@/constants/client";

export const PostFormContext = createContext<ReturnType<typeof usePostForm>>({
  formData: constants.defaultFormData,
  loading: false,
  error: undefined,
  onChange: () => {},
  onDraftSubmit: async () => {},
  onPublishSubmit: async () => {},
  submitType: undefined,
});

interface PostFormProviderProps {
  children?: React.ReactNode;
  initialFormData?: PostFormData;
}

export const PostFormProvider = ({
  children,
  initialFormData,
}: PostFormProviderProps) => {
  const form = usePostForm({ initialFormData });

  return (
    <PostFormContext.Provider value={form}>{children}</PostFormContext.Provider>
  );
};
