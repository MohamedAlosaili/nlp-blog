"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sendCommentAction } from "./actions";
import { CommentFormData, ErrorCode } from "@/types";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Share } from "lucide-react";

export const CommentForm = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [formData, setFormData] = useState<CommentFormData>({
    postId: parseInt((params.postId as string) ?? ""),
    content: "",
    senderName: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData || !formData.senderName?.trim()) {
        return setError("sender_name_required");
      } else if (!formData.content?.trim()) {
        return setError("content_required");
      }

      setLoading(true);
      const { errorCode } = await sendCommentAction(formData);
      setLoading(false);
      if (errorCode) {
        return setError(errorCode);
      }

      setFormData({
        postId: parseInt((params.postId as string) ?? ""),
        content: "",
        senderName: "",
      });
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError(undefined);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 rounded-md border border-s-zinc-200 space-y-4"
    >
      {error && <ErrorMessage error={error} />}
      <Input
        required
        type="text"
        name="senderName"
        value={formData.senderName}
        onChange={onChange}
        placeholder="اسمك"
      />
      <textarea
        required
        className="flex resize-y h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        name="content"
        value={formData?.content ?? ""}
        onChange={onChange}
        placeholder="أكتب تعليقك هنا..."
      />
      <Button className="flex mr-auto" disabled={loading}>
        {loading && <LoadingSpinner />} إرسال
      </Button>
    </form>
  );
};

export const SharePost = () => {
  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Button onClick={share} className="flex items-center gap-2">
        <Share className="text-base" size={16} />
        مشاركة
      </Button>
    </div>
  );
};
