import { Metadata } from "next";
import "server-only";

const constants = {
  tokenExpire: "120d",
  cookieExpire: 120 * 24 * 60 * 60 * 1000,
  redirectAfterLoginPath: "/",
  profilePhotoStoragePath: "profile",
  postPhotoStoragePath: "posts",
};

export const SITE_URL = process.env.SITE_URL ?? "";

const openGraphMetaData: Metadata["openGraph"] = {
  title: {
    template: `لغة | %s`,
    default: "لغة",
  },
  type: "website",
  description: "تابع آخر مستجدات معالجة اللغات الطبيعية مع لغة",
  images: [`${SITE_URL}/images/opengraph-image.png?v=2`],
  url: SITE_URL,
  siteName: "لغة",
};

const twitterMetaData: Metadata["twitter"] = {
  title: {
    template: `لغة | %s`,
    default: "لغة",
  },
  description: "تابع آخر مستجدات معالجة اللغات الطبيعية مع لغة",
  images: [`${SITE_URL}/images/twitter-image.png?v=2`],
  card: "summary",
};

export const generalMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `لغة | %s`,
    default: "لغة",
  },
  authors: [{ name: "لغة", url: SITE_URL }],
  keywords: ["لغة", "معالجة اللغات الطبيعية", "nlp بالعربي"],
  description: "تابع آخر مستجدات معالجة اللغات الطبيعية مع لغة",
  icons: ["/images/favicon.ico"],
  openGraph: openGraphMetaData,
  twitter: twitterMetaData,
};

export default constants;
