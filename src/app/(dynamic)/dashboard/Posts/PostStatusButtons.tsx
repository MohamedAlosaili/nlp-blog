"use client";

import { changePostStateAction } from "../actions";
import { Switch } from "@/components/ui/switch";
import { IDashboardPost } from "@/types";
import { useRef, useState } from "react";

export const PostStatusButtons = ({ post }: { post: IDashboardPost }) => {
  return (
    <div className="flex flex-col gap-4">
      <PublishPostButton post={post} />
      <DeletePostButton post={post} />
    </div>
  );
};

const DeletePostButton = ({ post }: { post: IDashboardPost }) => {
  const [isDeleted, setIsDeleted] = useState(!!post.isDeleted);
  const timeoutId = useRef<NodeJS.Timeout>();

  const onDeleteStateChange = async (isDeleted: boolean) => {
    clear();
    try {
      const { errorCode } = await changePostStateAction({
        postId: post.id,
        action: isDeleted ? "delete" : "unDelete",
      });

      if (errorCode) {
        setIsDeleted(prev => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
  };

  const onCheckedChange = (v: boolean) => {
    setIsDeleted(prev => !prev);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => onDeleteStateChange(v), 500);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="isPostDeleted"
        checked={isDeleted}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-red-600"
      />
      <label htmlFor="isPostDeleted" className="text-sm text-red-600">
        {isDeleted ? "المقال محذوف" : "المقال غير محذوف"}
      </label>
    </div>
  );
};

const PublishPostButton = ({ post }: { post: IDashboardPost }) => {
  const [isPublished, setIsPublished] = useState(!!post.isPublished);
  const timeoutId = useRef<NodeJS.Timeout>();

  const onPublishStateChange = async (isPublished: boolean) => {
    clear();
    try {
      const { errorCode } = await changePostStateAction({
        postId: post.id,
        action: isPublished ? "publish" : "unPublish",
      });

      if (errorCode) {
        setIsPublished(prev => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
  };

  const onCheckedChange = (v: boolean) => {
    setIsPublished(prev => !prev);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => onPublishStateChange(v), 500);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="isPostPublished"
        checked={isPublished}
        onCheckedChange={onCheckedChange}
      />
      <label htmlFor="isPostPublished" className="text-sm">
        {isPublished ? "منشور" : "غير منشور"}
      </label>
    </div>
  );
};
