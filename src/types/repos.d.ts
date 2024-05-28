import { ErrorCode } from ".";

export interface GetUserData {
  type: "id" | "email";
  value: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  photo?: string;
  resetPasswordToken?: string;
  isDeleted: number;
  verified: number;
}

interface Post {
  id: number;
  title: string;
  summary: string;
  coverImage: string;
  content: string;
  userId: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface IPost extends Post {
  published: boolean;
  isDeleted: boolean;
  updatedAt: string;
}

export interface IDraft extends Post {
  tags: string;
  postId: number;
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
  summary: string;
  coverImage: string;
  tags: string;
  content: string;
  userId: number;
}

export interface NewPostData {
  title: string;
  summary: string;
  coverImage: string;
  content: string;
  userId: number;
}
