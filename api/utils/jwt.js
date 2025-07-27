import jwt from "jsonwebtoken";

// 1. Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 2. Set Token in Cookie
export const setTokenAndCookie = (user, res) => {
  const token = generateToken(user._id);

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true, // Prevents JS access
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
  });

  return token;
};
