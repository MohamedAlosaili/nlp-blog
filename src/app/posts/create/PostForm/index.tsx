"use client";

import { Input } from "@/components/ui/input";
import { PostFormContext, PostFormProvider } from "./PostFormContext";
import { use, useEffect, useState } from "react";
import { APIJSONResponse, ErrorCode, Tag } from "@/types";
import constants from "@/constants/client";
import { ErrorMessage } from "@/components/ui/error-message";
import { TagsCombobox } from "@/components/ui/TagsCompobox";
import { BsXCircle } from "@/components/icons/reactIcons";
import { Button } from "@/components/ui/button";

export const PostForm = () => {
  return (
    <PostFormProvider>
      <Form />
    </PostFormProvider>
  );
};

export const Form = () => {
  const { onSubmit } = use(PostFormContext);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Title />
      <Summary />
      <CoverImage />
      <Tags />
    </form>
  );
};

export const Title = () => {
  const { formData, onChange } = use(PostFormContext);

  return (
    <Input
      required
      name="title"
      label="العنوان"
      inputMode="text"
      placeholder="عنوان المقال"
      enterKeyHint="next"
      value={formData.title}
      onChange={e => onChange({ name: "title", value: e.target.value })}
    />
  );
};

export const Summary = () => {
  const { formData, onChange } = use(PostFormContext);

  return (
    <Input
      required
      name="summary"
      label="الملخص"
      inputMode="text"
      placeholder="ملخص مختصر عن المقال"
      enterKeyHint="next"
      value={formData.summary}
      onChange={e => onChange({ name: "summary", value: e.target.value })}
    />
  );
};

export const CoverImage = () => {
  const { formData, onChange } = use(PostFormContext);
  const [error, setError] = useState<ErrorCode>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    const file = e.target.files?.[0];
    if (!file) {
      return setError("invalid_file_type");
    }

    if (!file.type.startsWith("image/")) {
      return setError("invalid_file_type");
    }

    if (file.size > constants.maxImageSize) {
      return setError("invalid_file_size");
    }

    onChange({ name: "coverImage", value: file });
  };

  const preview =
    formData.coverImage && URL.createObjectURL(formData.coverImage);
  return (
    <div className="space-y-2">
      {preview && (
        <div className="w-fit mx-auto">
          <img
            src={preview}
            alt="Cover Image"
            className="h-48 rounded-md mx-auto"
          />
          <button
            onClick={() => onChange({ name: "coverImage", value: undefined })}
            type="button"
            className="block w-fit text-sm mt-1 mx-auto underline"
          >
            حذف الصورة
          </button>
        </div>
      )}
      <Input
        type="file"
        name="coverImage"
        label="صورة الغلاف"
        accept="image/*"
        value={""}
        placeholder="اختر صورة"
        onChange={onFileChange}
      />
      {error && <ErrorMessage error={error} className="text-start text-xs" />}
    </div>
  );
};

export const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { formData, onChange } = use(PostFormContext);
  const [error, setError] = useState<ErrorCode>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tags")
      .then(res => res.json())
      .then(({ errorCode, data }: APIJSONResponse<Tag[]>) => {
        setLoading(false);
        if (errorCode || !data) {
          return setError(errorCode ?? "internal_server_error");
        }
        setTags(data.map(tag => ({ ...tag, isNew: false })));
      })
      .catch(() => {
        setLoading(false);
        setError("internal_server_error");
      });
  }, []);

  const onSelectingTag = (tagId: number) => {
    if (formData.tags.some(tag => tag.id === tagId)) {
      return;
    }
    const tag = tags.find(tag => tag.id === tagId);
    if (tag) {
      onChange({ name: "tags", value: [...formData.tags, tag] });
    }
  };

  const removeTag = (tagId: number) => {
    onChange({
      name: "tags",
      value: formData.tags.filter(tag => tag.id !== tagId),
    });
  };

  const addNewTag = (tagName: string) => {
    const newTag = { id: tags.length + 1, name: tagName, isNew: true };
    setTags([...tags, newTag]);
    onChange({ name: "tags", value: [...formData.tags, newTag] });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p>التصنيفات</p>
        {loading && <span className="text-xs">تحميل التصنيفات...</span>}
      </div>
      {error && <ErrorMessage error={error} className="text-start text-xs" />}
      <TagsCombobox
        tags={tags}
        onSelect={onSelectingTag}
        addNewTag={addNewTag}
      />
      <div className="flex flex-wrap gap-2">
        {formData.tags.map(tag => (
          <div
            key={tag.id + tag.name}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-200 text-sm"
          >
            <span>{tag.name}</span>
            <button type="button" onClick={() => removeTag(tag.id)}>
              <BsXCircle className="text-zinc-700" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
