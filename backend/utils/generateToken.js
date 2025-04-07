import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Cannot be accessed by JavaScript (to avoid XSS attacks)
    secure: process.env.NODE_ENV !== "development", // Use Secure Cookies in production
    maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 1 day
    sameSite: "strict",
  });
};
