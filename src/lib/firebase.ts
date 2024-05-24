import "server-only";

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = require("@/../firebaseServiceAccountKey.json") as Record<
  string,
  string
>;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "gs://nlp-blog-adb56.appspot.com",
  });
}

export const bucket = getStorage().bucket();
