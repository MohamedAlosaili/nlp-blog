"use client";

import { CloudOff, Trash } from "lucide-react";
import { useState } from "react";
import {
  deleteDraftAction,
  deletePostAction,
  unPublishPostAction,
} from "./actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DeletePostButtonProps {
  postId: number;
  postType: "draft" | "post";
}

export const DeletePostButton = ({
  postId,
  postType,
}: DeletePostButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      if (postType === "draft") {
        await deleteDraftAction({ postId });
      } else {
        await deletePostAction({ postId });
      }
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        <Trash />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>حذف المقال</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من حذف المقال؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            متابعة
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const UnPublishPostButton = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await unPublishPostAction({ postId });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        <CloudOff />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>إلغاء النشر</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من إلغاء النشر؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            متابعة
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
