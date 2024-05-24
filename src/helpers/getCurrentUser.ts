import "server-only";
import { getIdFromToken } from "./getIdFromToken";
import { getUser } from "@/repos/users";
import { getProfileImage } from "@/utils/images";

export const getCurrentUser = async () => {
  try {
    const id = getIdFromToken();
    if (!id) {
      return;
    }

    const userData = await getUser({ type: "id", value: `${id}` });
    if (userData) {
      const { password, resetPasswordToken, ...user } = userData;
      if (user.photo) {
        user.photo = getProfileImage(user.photo);
      }
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
