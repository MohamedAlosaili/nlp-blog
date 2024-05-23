import bcrypt from "bcrypt";

export const hashPassword = async ({ password }: { password: string }) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => {
  return bcrypt.compare(password, hashedPassword);
};
