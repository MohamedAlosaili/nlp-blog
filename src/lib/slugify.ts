import slugifyLib from "slugify";

export const slugify = (s: string) =>
  slugifyLib(s, { lower: true, strict: true, locale: "en" });
