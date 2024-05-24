import { ErrorCode } from "@/types";

const errorMessages: Record<ErrorCode, string> = {
  internal_server_error: "حدث خطأ ما الرجاء المحولة لاحقًا",
  duplicate_email: "البريد الإلكتروني موجود بالفعل",
  name_required: "الاسم مطلوب",
  email_required: "الايميل مطلوب",
  password_required: "كلمة المرور مطلوبة",
  invalid_name: "الرجاء إدخال اسم صحيح",
  invalid_email: "الرجاء إدخال بريد إلكتروني صحيح",
  invalid_password: "الرجاء إدخال كلمة مرور صحيحة",
  invalid_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
};

export const toErrorMessage = ({ errorCode }: { errorCode: ErrorCode }) => {
  return errorMessages[errorCode] ?? errorMessages.internal_server_error;
};
