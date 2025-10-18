// utils/verifyToken.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized ❌" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize common fields so downstream controllers can reliably use them
    const id = decoded?.id || decoded?._id || decoded?.userId || decoded?.sub || decoded?.user?.id || decoded?.user?._id;
    const email = decoded?.email || decoded?.user?.email || decoded?.payload?.email;
    req.user = { ...decoded, ...(id ? { id: String(id) } : {}), ...(email ? { email: String(email) } : {}) };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired ❌" });
  }
};

export default verifyToken;
