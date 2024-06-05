export const formatDate = (date: string) => {
  return new Date(date).toLocaleString("ar", {
    dateStyle: "long",
    numberingSystem: "mathsans",
  });
};
