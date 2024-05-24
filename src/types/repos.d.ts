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
  isDeleted: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}
