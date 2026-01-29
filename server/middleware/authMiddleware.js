import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // ✅ Extract token
  const token = authHeader.split(" ")[1];
  console.log("🔍 Incoming Token:", token); // 👈 Debug: print token received

  try {
    // ✅ Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified, Payload:", decoded);

    // ✅ Attach user data to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
