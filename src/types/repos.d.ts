import { ErrorCode, Tag } from ".";

export interface GetUserData {
  type: "id" | "email";
  value: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  photo?: string;
  resetPasswordToken?: string;
  isDeleted: number;
  verified: number;
  role: "user" | "admin";
}

export interface IDashboardUser
  extends Pick<
    IUser,
    "id" | "name" | "email" | "photo" | "verified" | "isDeleted"
  > {}

interface Post {
  id: number;
  title: string;
  authorName: string;
  slug: string;
  summary: string;
  coverImage: string;
  content: string;
  userId: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface IPost extends Post {
  isPublished: boolean;
  updatedAt: string;
}

export interface IDashboardPost
  extends Pick<
    IPost,
    | "id"
    | "title"
    | "authorName"
    | "summary"
    | "coverImage"
    | "isDeleted"
    | "isPublished"
  > {}

export interface IDraft extends Post {
  tags: string;
  postId: number;
}

export interface IComment {
  id: number;
  content: string;
  senderName: string;
  userId: number;
  postId: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface ICurrentUser
  extends Omit<IUser, "password" | "resetPasswordToken"> {}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateResetPasswordTokenData {
  email: string;
  token: string | null;
}

export interface RepoReturn<T = any> {
  data?: T;
  errorCode?: ErrorCode;
}

export interface UpdatePasswordData {
  userId: number;
  password: string;
}

export interface UpdateUserInfoData {
  userId: number;
  name?: string;
  phone?: string;
}

export interface UpdatePhotoData {
  userId: number;
  photo: string;
}

export interface DraftData {
  title: string;
  authorName?: string;
  slug: string;
  summary: string;
  coverImage: string;
  tags: string;
  content: string;
  userId: number;
}

export interface NewPostData {
  title: string;
  authorName?: string;
  slug: string;
  summary: string;
  coverImage: string;
  tags: Tag[];
  content: string;
  userId: number;
}

export interface CommentData {
  content: string;
  senderName: string;
  postId: number;
  userId?: number;
}
