import { ErrorCode, PostFormData, PostType, SubmitButtonType } from "@/types";
import { useState } from "react";
import {
  publishPostAction,
  saveDraftPostAction,
} from "@/app/posts/create/action";
import { useParams, usePathname, useRouter } from "next/navigation";
import constants from "@/constants/client";
import {
  editDraftAction,
  editPostAction,
} from "@/app/(dynamic)/edit/[type]/[postId]/actions";
import { deleteDraftAction } from "@/app/posts/my/actions";

interface UsePostFormProps {
  initialFormData?: PostFormData;
}

export const usePostForm = ({
  initialFormData = constants.defaultFormData,
}: UsePostFormProps) => {
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [submitType, setSubmitType] = useState<SubmitButtonType>();
  const router = useRouter();
  const params = useParams<{ postId: string; type: PostType }>();
  const pathname = usePathname();

  const onChange = <T extends keyof PostFormData>({
    name,
    value,
  }: {
    name: T;
    value: PostFormData[T];
  }) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onDraftSubmit = async () => {
    try {
      const error = checkFields();
      if (params.type === "posts") {
        throw new Error("Invalid call");
      }

      if (error) {
        setError(error);
        return;
      }

      setLoading(true);
      setSubmitType("draft");
      let errorCode: ErrorCode | undefined;

      if (params.postId) {
        errorCode = (
          await editDraftAction({
            id: parseInt(params.postId),
            ...formData,
          })
        ).errorCode;
      } else {
        errorCode = (await saveDraftPostAction({ formData })).errorCode;
      }
      setLoading(false);

      if (errorCode) {
        setError(errorCode);
        return;
      }

      router.push("/posts/my");
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

      if (params.type === "drafts") {
        await deleteDraftAction({ draftId: parseInt(params.postId) });
      }

      setLoading(true);
      setSubmitType("publish");
      let postId = params.postId;
      let errorCode: ErrorCode | undefined;

      if (postId && params.type === "posts") {
        errorCode = (
          await editPostAction({ id: parseInt(postId), ...formData })
        ).errorCode;
      } else {
        const result = await publishPostAction({ formData });
        errorCode = result.errorCode;
        postId = result.data.post.id;
      }

      setLoading(false);

      if (errorCode) {
        setError(errorCode);
        return;
      }

      if (
        params.type !== "drafts" &&
        (formData.isPublished || pathname === "/posts/create")
      ) {
        router.push(`/posts/${postId}`);
      } else {
        router.push(`/posts/my`);
      }
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
