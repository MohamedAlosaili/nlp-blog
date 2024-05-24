import "server-only";

const storageUrl = process.env.PROFILE_URL;

if (!storageUrl) {
  throw new Error("Missing NEXT_PUBLIC_PROFILE_URL");
}

export const getProfileImage = (filename: string) => {
  return `${storageUrl}${filename}?alt=media`;
};
