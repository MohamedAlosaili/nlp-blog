"use client";

import { Input } from "@/components/ui/input";
import { PostFormContext, PostFormProvider } from "./PostFormContext";
import { Dispatch, use, useEffect, useState } from "react";
import { APIJSONResponse, ErrorCode, Tag } from "@/types";
import constants from "@/constants/client";
import { ErrorMessage } from "@/components/ui/error-message";
import { TagsCombobox } from "@/components/ui/TagsCompobox";
import { BsXCircle } from "@/components/icons/reactIcons";
import { TextEditor } from "./TextEditor";
import { randomId } from "@/lib/randomId";
import { deleteImageAction, uploadImageAction } from "../action";
import { Copy, CopyCheck, XCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getPostImage } from "@/utils/images";
import { Button } from "@/components/ui/button";

export const PostForm = () => {
  return (
    <PostFormProvider>
      <Form />
    </PostFormProvider>
  );
};

export const Form = () => {
  const { onDraftSubmit, onPublishSubmit, loading, submitType, error } =
    use(PostFormContext);

  return (
    <div className="flex flex-col gap-6">
      {error && <ErrorMessage error={error} className="text-lg" />}
      <Title />
      <Summary />
      <CoverImage />
      <Tags />
      <ImageUploader />
      <TextEditor />
      <div className="flex items-center justify-end gap-4">
        <Button disabled={loading} variant="outline" onClick={onDraftSubmit}>
          {loading && submitType === "draft" && <LoadingSpinner />}
          حفظ كمسودة
        </Button>
        <Button onClick={onPublishSubmit} disabled={loading}>
          {loading && submitType === "publish" && <LoadingSpinner />}
          نشر المقال
        </Button>
      </div>
    </div>
  );
};

export const Title = () => {
  const { formData, loading, onChange } = use(PostFormContext);

  return (
    <Input
      required
      disabled={loading}
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
  const { formData, loading, onChange } = use(PostFormContext);

  return (
    <Input
      required
      disabled={loading}
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
  const { formData, onChange, ...form } = use(PostFormContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { errorCode, data } = await uploadImageAction({ formData });
      setLoading(false);

      if (errorCode || !data?.filename) {
        return setError(errorCode ?? "internal_server_error");
      }

      onChange({ name: "coverImage", value: data.filename });
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const removeCoverImage = async () => {
    try {
      setLoading(true);
      const { errorCode } = await deleteImageAction(formData.coverImage);
      setLoading(false);

      if (errorCode) {
        setError(errorCode);
      }

      onChange({ name: "coverImage", value: "" });
    } catch (error) {}
    onChange({ name: "coverImage", value: "" });
  };

  return (
    <div className="space-y-2">
      <div className="mb-2 flex items-center gap-2">
        <p className="font-semibold ">الصورة الرئيسية</p>
        {loading && !formData.coverImage && (
          <p className="flex items-center text-xs">
            <LoadingSpinner /> جاري رفع الصورة...
          </p>
        )}
        {error && <ErrorMessage error={error} className="text-start text-xs" />}
      </div>
      {formData.coverImage ? (
        <div className="w-fit mx-auto">
          <img
            src={getPostImage(formData.coverImage)}
            alt="Cover Image"
            className="h-48 rounded-md mx-auto"
          />
          <button
            onClick={removeCoverImage}
            type="button"
            className="block w-fit text-sm mt-1 mx-auto underline flex items-center"
          >
            {loading && <LoadingSpinner />}حذف الصورة
          </button>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            disabled={loading || form.loading}
            name="coverImage"
            accept="image/*"
            value={""}
            placeholder="اختر صورة"
            onChange={onFileChange}
          />
        </div>
      )}
    </div>
  );
};

export const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { formData, onChange, ...form } = use(PostFormContext);
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
        setTags(data);
      })
      .catch(() => {
        setLoading(false);
        setError("internal_server_error");
      });
  }, []);

  const onSelectingTag = (tagId: number) => {
    if (loading || form.loading) return;

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

  const addNewTag = (tag: Tag) => {
    setTags([...tags, tag]);
    onChange({ name: "tags", value: [...formData.tags, tag] });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="font-semibold">التصنيفات</p>
        {loading && <LoadingSpinner />}
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

interface UploadImage {
  id: string;
  file: File;
  filename?: string;
  errorCode?: ErrorCode;
}

const ImageUploader = () => {
  const { loading } = use(PostFormContext);
  const [images, setImages] = useState<UploadImage[]>([]);

  const onFilesChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    let newImages: UploadImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const newImage = {
        id: randomId(),
        file: files[i],
      };

      newImages.push(newImage);

      const formData = new FormData();
      formData.append("image", files[i]);
      uploadImageAction({ formData }).then(({ errorCode, data }) => {
        setImages(images =>
          images.map(img => {
            if (img.id === newImage.id) {
              return errorCode || !data?.filename
                ? { ...img, errorCode }
                : { ...img, filename: data.filename };
            }
            return img;
          })
        );
      });
    }

    setImages(prevImages => [...prevImages, ...newImages]);
  };

  return (
    <div>
      <p className="font-semibold">الصور</p>
      <div className="flex flex-col gap-2 text-sm py-4">
        <p>- ارفع أي نوع صورة لإضافتها للمقال</p>
        <p>- انسخ أي رابط من قائمة الصور</p>
        <p>- قم بحذف أي صورة لم يتم استخدامها</p>
      </div>
      <Button type="button" disabled={loading}>
        <label htmlFor="post-images">
          إضافة صورة
          <input
            hidden
            id="post-images"
            type="file"
            name="images"
            accept="image/*"
            multiple
            value={""}
            onChange={onFilesChanges}
          />
        </label>
      </Button>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 py-4">
          {images.map(image => (
            <UploaderImage key={image.id} image={image} setImages={setImages} />
          ))}
        </div>
      )}
    </div>
  );
};

interface UploaderImageProps {
  image: UploadImage;
  setImages: Dispatch<React.SetStateAction<UploadImage[]>>;
}

const UploaderImage = ({ image, setImages }: UploaderImageProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [copied, setCopied] = useState(false);
  const form = use(PostFormContext);

  const onCopyClick = () => {
    if (loading || !image.filename) return;
    navigator.clipboard.writeText(getPostImage(image.filename));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const deleteLink = async () => {
    try {
      if (!image.filename) {
        return setImages(images => images.filter(img => img.id !== image.id));
      }

      setLoading(true);
      const { errorCode } = await deleteImageAction(image.filename);
      setImages(images => images.filter(img => img.id !== image.id));
      setLoading(false);

      if (errorCode) {
        setError(errorCode);
      }
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const reuploadImage = () => {
    const formData = new FormData();
    formData.append("image", image.file);

    // Reset the errorCode
    setImages(images =>
      images.map(img => {
        if (img.id === image.id) {
          return { ...img, errorCode: undefined };
        }
        return img;
      })
    );

    uploadImageAction({ formData }).then(({ errorCode, data }) => {
      setImages(images =>
        images.map(img => {
          if (img.id === image.id) {
            return errorCode || !data?.filename
              ? { ...img, errorCode }
              : { ...img, filename: data.filename };
          }
          return img;
        })
      );
    });
  };

  if (image.errorCode) {
    return (
      <div className="flex items-center flex-col gap-2 h-16">
        <span className="text-sm">حدث خطأ أثناء رفع الصورة</span>
        <Button
          type="button"
          onClick={reuploadImage}
          className="text-xs"
          disabled={form.loading}
        >
          محاولة مرة أخرى
        </Button>
      </div>
    );
  }

  if (!image.filename) {
    return <div className="flex items-center h-16">جاري رفع الملف...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {error && <ErrorMessage error={error} className="text-xs" />}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onCopyClick}
          className="text-xs flex gap-2 items-center"
        >
          {copied ? (
            <>
              <CopyCheck size={20} />
              تم النسخ
            </>
          ) : (
            <>
              <Copy size={20} />
              نسخ
            </>
          )}
        </button>
        <button
          disabled={form.loading}
          type="button"
          onClick={deleteLink}
          className="flex items-center gap-2 text-xs"
        >
          {loading ? (
            <>
              <LoadingSpinner className="m-0" />
              جاري الحذف
            </>
          ) : (
            <>
              <XCircle size={16} />
              حذف الصورة
            </>
          )}
        </button>
      </div>
      {image.filename && (
        <img
          src={getPostImage(image.filename)}
          height={64}
          width={64}
          className="w-auto h-16 rounded-md"
        />
      )}
    </div>
  );
};
