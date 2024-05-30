import { ErrorCode } from "@/types";

const errorMessages: Record<ErrorCode, string> = {
  internal_server_error: "حدث خطأ ما الرجاء المحولة لاحقًا",
  duplicate_email: "البريد الإلكتروني موجود بالفعل",
  name_required: "الاسم مطلوب",
  email_required: "الايميل مطلوب",
  password_required: "كلمة المرور مطلوبة",
  invalid_name: "الرجاء إدخال اسم صحيح",
  invalid_email: "الرجاء إدخال بريد إلكتروني صحيح",
  invalid_password: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  wrong_password: "كلمة المرور غير صحيحة",
  invalid_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  invalid_reset_password_token: "رمز إعادة تعيين كلمة المرور غير صالح",
  passwords_not_match: "كلمات المرور غير متطابقة",
  invalid_file_type: "نوع الملف غير صالح",
  invalid_file_size: "حجم الملف كبير جدًا",
};

export const toErrorMessage = ({ errorCode }: { errorCode: ErrorCode }) => {
  return errorMessages[errorCode] ?? errorMessages.internal_server_error;
};
