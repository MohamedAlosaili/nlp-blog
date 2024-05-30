const profilePhotoUrl = process.env.NEXT_PUBLIC_PROFILE_PHOTO_URL;
const postPhotoUrl = process.env.NEXT_PUBLIC_POST_PHOTO_URL;

if (!profilePhotoUrl || !postPhotoUrl) {
  throw new Error("Missing PROFILE_URL");
}

export const getProfileImage = (filename: string) => {
  return `${profilePhotoUrl}${filename}?alt=media`;
};

export const getPostImage = (filename: string) => {
  return `${postPhotoUrl}${filename}?alt=media`;
};
