import { ErrorCode, PostFormData } from "@/types";
import { useState } from "react";
import { publishPostAction, saveDraftPostAction } from "../action";
import { useRouter } from "next/navigation";

export const defaultFormData: PostFormData = {
  title: "",
  tags: [],
  summary: "",
  coverImage: "",
  content: "<h1>اكتب هنا...</h1>",
};

export const usePostForm = () => {
  const [formData, setFormData] = useState<PostFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [submitType, setSubmitType] = useState<"draft" | "publish">();
  const router = useRouter();

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

  const onDraftSubmit = async () => {
    try {
      const error = checkFields();
      if (error) {
        setError(error);
        return;
      }

      setLoading(true);
      setSubmitType("draft");
      const { data, errorCode } = await saveDraftPostAction({ formData });
      setLoading(false);

      if (errorCode || !data) {
        setError(errorCode);
        return;
      }

      router.push("/drafts");
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onPublishSubmit = async () => {
    try {
      const error = checkFields();
      if (error) {
        setError(error);
        return;
      }

      setLoading(true);
      setSubmitType("publish");
      const { data, errorCode } = await publishPostAction({ formData });
      setLoading(false);

      if (errorCode || !data) {
        setError(errorCode);
        return;
      }

      router.push(`/posts/${data.post.id}`);
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const checkFields = (): ErrorCode | undefined => {
    setError(undefined);
    if (!formData.title.trim()) {
      return "title_required";
    } else if (!formData.summary.trim()) {
      return "summary_required";
    } else if (!formData.coverImage) {
      return "cover_image_required";
    } else if (formData.tags.length === 0) {
      return "tags_required";
    } else if (!formData.content.trim()) {
      return "content_required";
    }
  };

  return {
    formData,
    submitType,
    loading,
    error,
    onChange,
    onDraftSubmit,
    onPublishSubmit,
  };
};
