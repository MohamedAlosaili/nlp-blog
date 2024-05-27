export * from "./repos";
export * from "./posts";

export interface ActionReturn<T = any> {
  errorCode?: ErrorCode;
  data?: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface EditProfileData {
  name: string;
  photo?: File;
  phone?: string;
}

export interface APIJSONResponse<T = any> {
  success: boolean;
  data?: T;
  errorCode?: ErrorCode;
}

export type ErrorCode =
  | "internal_server_error"
  | "invalid_credentials"
  | "duplicate_email"
  | "invalid_email"
  | "wrong_password"
  | "invalid_name"
  | "invalid_password"
  | "name_required"
  | "email_required"
  | "password_required"
  | "passwords_not_match"
  | "invalid_file_type"
  | "invalid_file_size"
  | "title_required"
  | "summary_required"
  | "cover_image_required"
  | "tags_required"
  | "content_required"
  | "invalid_reset_password_token";

export type CookieName = "session";
