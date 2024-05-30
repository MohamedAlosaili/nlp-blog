import "server-only";
import { getTokenPayload } from "@/lib/jwt";
import { getCookie } from "@/lib/cookies";

export const getIdFromToken = () => {
  const token = getCookie({ name: "session" });
  if (!token) {
    return;
  }

  return getTokenPayload<{ id: number }>({ token })?.id;
};
