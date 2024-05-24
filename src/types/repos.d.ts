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
  isDeleted: boolean;
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

export interface RepoMutationReturn {
  success: boolean;
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
