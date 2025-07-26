import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Access denied (Admins only)" });
  }
  next();
};
// export const isEmployee = (req, res, next) => {
//   if (req.user?.role !== 'Employee') {
//     return res.status(403).json({ message: 'Access denied (Employees only)' });
//   }
//   next();
// }

export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded ID:", decoded.id);

  const user = await User.findById(decoded.id).select("-passwordHash");
  console.log("Found user:", user);

  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;
  next();
} catch (error) {
  console.error("JWT Error:", error.message);
  res.status(401).json({ message: "Invalid token" });
}
};
