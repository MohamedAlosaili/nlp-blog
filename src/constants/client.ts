import { PostFormData } from "@/types";

const constants = {
  redirectAfterLoginPath: "/posts/my",
  maxImageSize: 5 * 1024 * 1024,
  profilePhotoStoragePath: "profile",
  postPhotoStoragePath: "posts",
  defaultFormData: {
    title: "",
    tags: [],
    summary: "",
    coverImage: "",
    content: "<h1>اكتب هنا...</h1>",
  } as PostFormData,
};

export default constants;
