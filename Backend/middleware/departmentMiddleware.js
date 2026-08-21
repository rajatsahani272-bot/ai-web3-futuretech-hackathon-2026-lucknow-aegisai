import jwt from "jsonwebtoken";

const departmentMiddleware = (
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

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (decoded.role !== "department") {
      return res.status(403).json({
        success: false,
        message:
          "Department access required",
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "Department middleware error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

export default departmentMiddleware;