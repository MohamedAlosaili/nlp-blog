"use client";

import { changeUserStateAction } from "../actions";
import { Switch } from "@/components/ui/switch";
import { IDashboardUser } from "@/types";
import { useRef, useState } from "react";

export const UserStatusButtons = ({ user }: { user: IDashboardUser }) => {
  return (
    <div className="flex flex-col sm:items-end gap-4">
      <VerifyUserButton user={user} />
      <DeleteUserButton user={user} />
    </div>
  );
};

const DeleteUserButton = ({ user }: { user: IDashboardUser }) => {
  const [isDeleted, setIsDeleted] = useState(!!user.isDeleted);
  const timeoutId = useRef<NodeJS.Timeout>();

  const onDeleteStateChange = async (isDeleted: boolean) => {
    clear();
    try {
      const { errorCode } = await changeUserStateAction({
        userId: user.id,
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
    <div className="flex items-center gap-2 flex-row-reverse justify-end sm:justify-start sm:flex-row">
      <label htmlFor="isUserDeleted" className="text-sm text-red-600">
        {isDeleted ? "المستخدم محذوف" : "المستخدم غير محذوف"}
      </label>
      <Switch
        id="isUserDeleted"
        checked={isDeleted}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-red-600"
      />
    </div>
  );
};

const VerifyUserButton = ({ user }: { user: IDashboardUser }) => {
  const [isVerified, setIsVerified] = useState(!!user.verified);
  const timeoutId = useRef<NodeJS.Timeout>();

  const onVerifiedStateChange = async (isVerified: boolean) => {
    clear();
    try {
      const { errorCode } = await changeUserStateAction({
        userId: user.id,
        action: isVerified ? "verify" : "unVerify",
      });

      if (errorCode) {
        setIsVerified(prev => !prev);
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
    setIsVerified(prev => !prev);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => onVerifiedStateChange(v), 500);
  };

  return (
    <div className="flex items-center gap-2 flex-row-reverse justify-end sm:justify-start sm:flex-row">
      <label htmlFor="isUserVerified" className="text-sm">
        {isVerified ? "المستخدم موثق" : "المستخدم غير موثق"}
      </label>
      <Switch
        id="isUserVerified"
        checked={isVerified}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
