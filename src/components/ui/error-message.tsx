"use client";

import { toErrorMessage } from "@/helpers/toErrorMessage";
import { cn } from "@/lib/utils";
import { ErrorCode } from "@/types";
import { useEffect, useRef } from "react";

interface ErrorMessageProps {
  error: ErrorCode;
  className?: string;
}

export const ErrorMessage = ({ error, className }: ErrorMessageProps) => {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorRef && error) {
      errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [error]);

  return (
    <p
      ref={errorRef}
      className={cn("text-center text-sm text-red-600", className)}
    >
      {toErrorMessage({ errorCode: error })}
    </p>
  );
};
