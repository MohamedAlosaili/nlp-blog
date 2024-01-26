export const postRoute = (filePath: string) => {
  const fileName = filePath.split(/\\|\//).pop() || "";

  return fileName.replace(/\.md$/, "").replace(/\/index$/, "");
};
