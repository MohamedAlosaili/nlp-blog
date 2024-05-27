import "server-only";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { CookieName } from "@/types";
import constants from "@/constants/server";

type Options = Partial<ResponseCookie>;

export const commonCookieOptions: Options = {
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + constants.cookieExpire),
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

export const getCookie = ({ name }: Pick<CookieData, "name">) => {
  return cookies().get(name)?.value;
};

interface CookieData {
  name: CookieName;
  value: string;
  options?: Options;
}

export const setCookie = ({ name, value, options }: CookieData) => {
  cookies().set(name, value, { ...commonCookieOptions, ...options });
};

export const removeCookie = ({ name }: Pick<CookieData, "name">) => {
  cookies().set(name, "null", { expires: new Date() });
};
