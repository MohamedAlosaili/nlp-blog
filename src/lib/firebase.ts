import "server-only";

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const firebaseConfig = {
  project_id: process.env.PROJECT_ID!,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "", // Handle line breaks
  client_email: process.env.CLIENT_EMAIL!,
};

if (!getApps().length) {
  initializeApp({
    credential: cert({
      clientEmail: firebaseConfig.client_email,
      privateKey: firebaseConfig.private_key,
      projectId: firebaseConfig.project_id,
    }),
    storageBucket: "gs://nlp-blog-adb56.appspot.com",
  });
}

export const bucket = getStorage().bucket();
