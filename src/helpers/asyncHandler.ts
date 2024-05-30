import { ActionReturn } from "../types";

export const asyncHandler = async <T>(
  fn: () => Promise<ActionReturn<T>>
): Promise<ActionReturn<T>> => {
  try {
    const result = await fn();

    return result;
  } catch (error) {
    console.log(error);
    return { errorCode: "internal_server_error" };
  }
};
