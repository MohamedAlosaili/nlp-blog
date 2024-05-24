import "server-only";

const constants = {
  tokenExpire: "120d",
  cookieExpire: 120 * 24 * 60 * 60 * 1000,
  redirectAfterLoginPath: "/",
};

export default constants;