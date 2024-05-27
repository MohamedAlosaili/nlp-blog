import { bucket } from "@/lib/firebase";
import { ErrorCode } from "@/types";
import sharp from "sharp";

export const uploadFile = async (file: File, path: string, optimize = true) => {
  const _file = bucket.file(path);

  let fileBuffer = Buffer.from(await file.arrayBuffer());

  if (optimize) {
    const profile = path.includes("profile");
    fileBuffer = await optimizeImage(fileBuffer, profile ? 512 : 1280);
  }

  return new Promise<{ errorCode?: ErrorCode }>(resolve => {
    _file.save(
      Buffer.from(fileBuffer),
      {
        gzip: true,
        metadata: {
          contentType: file.type,
        },
      },
      err => {
        console.log(err);
        if (err) {
          resolve({ errorCode: "internal_server_error" });
        } else {
          resolve({});
        }
      }
    );
  });
};

const optimizeImage = (image: Buffer, width: number = 1200) => {
  // { failOn: "none" } prevent throwing errors on corrupted images
  return sharp(image, { failOn: "none" })
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
    })
    .toFormat("webp")
    .toBuffer();
};

export const deleteFile = async (path: string) => {
  return bucket.file(path).delete({ ignoreNotFound: true });
};
