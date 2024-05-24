"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ActionReturn,
  EditProfileData,
  ErrorCode,
  ICurrentUser,
} from "@/types";
import { useEffect, useState } from "react";
import { updateProfileImageAction, updateUserInfoAction } from "./actions";

interface FormProps {
  user: ICurrentUser;
}

export const Form = ({ user }: FormProps) => {
  const [formData, setFormData] = useState<EditProfileData>({
    name: user.name,
    phone: user.phone ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [success]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    const { name, value } = e.target;

    if (value.length > 100) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    setError(undefined);
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        return setError("name_required");
      }

      const requests: Promise<ActionReturn>[] = [];

      if (formData.photo) {
        const fd = new FormData();
        fd.append("photo", formData.photo);

        requests.push(updateProfileImageAction(fd));
      }

      if (
        formData.name.trim() !== user.name ||
        formData.phone?.trim() != user.phone
      ) {
        requests.push(
          updateUserInfoAction({ name: formData.name, phone: formData.phone })
        );
      }

      if (requests.length !== 0) {
        setLoading(true);
        const results = await Promise.all(requests);

        const errorCode = results.find(r => r.errorCode)?.errorCode;
        if (errorCode) {
          return setError(errorCode);
        }

        setFormData(prev => ({ ...prev, photo: undefined }));
      }
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return setError("invalid_file_type");
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError("invalid_file_size");
    }

    setFormData({
      ...formData,
      photo: file,
    });
  };

  const preview = formData.photo && URL.createObjectURL(formData.photo);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {success && (
        <div className="text-green-600 text-center">
          تم تحديث المعلومات بنجاح
        </div>
      )}
      {error && <ErrorMessage error={error} />}
      <div className="flex flex-col gap-2 items-center">
        <label htmlFor="user-photo">
          <input
            hidden
            id="user-photo"
            type="file"
            onChange={onFileChange}
            accept="image/*"
          />
          <Avatar
            src={preview ?? user.photo}
            alt={user.name}
            size={80}
            className="h-20 w-20"
          />
        </label>
        {preview && (
          <button
            onClick={() => setFormData(prev => ({ ...prev, photo: undefined }))}
            className="text-sm underline"
            type="button"
          >
            حذف الصورة
          </button>
        )}
      </div>

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
      <Input
        disabled={loading}
        name="phone"
        type="tel"
        inputMode="tel"
        enterKeyHint="next"
        placeholder="رقم الجوال"
        value={formData.phone}
        onChange={onChange}
      />
      <Button disabled={loading}>{loading && <LoadingSpinner />} حفظ</Button>
    </form>
  );
};
