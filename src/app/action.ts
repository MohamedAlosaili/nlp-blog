"use server";

import { removeCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  removeCookie({ name: "session" });
  redirect("/");
};
