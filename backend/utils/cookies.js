
const isProduction = () =>
  process.env.NODE_ENV === "production" ||
  process.env.RENDER === "true";

const sessionCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

module.exports = { sessionCookieOptions };
