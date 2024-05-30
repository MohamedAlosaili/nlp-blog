import { toErrorMessage } from "@/helpers/toErrorMessage";
import { cn } from "@/lib/utils";
import { ErrorCode } from "@/types";

interface ErrorMessageProps {
  error: ErrorCode;
  className?: string;
}

export const ErrorMessage = ({ error, className }: ErrorMessageProps) => (
  <p className={cn("text-center text-sm text-red-600", className)}>
    {toErrorMessage({ errorCode: error })}
  </p>
);
