import jwt from "jsonwebtoken";

const adminMiddleware = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

    if (
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin access required",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Admin middleware error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

export default adminMiddleware;