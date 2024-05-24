export const sendResetPasswordEmail = async ({
  url,
  email,
}: {
  url: string;
  email: string;
}) => {
  await new Promise(res => setTimeout(res, 2000));
};
