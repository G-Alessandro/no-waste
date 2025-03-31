const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(403).json({
      message: "Access denied, you must log in to access this feature",
    });

  jwt.verify(
    token.split(" ")[1],
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.user = decoded;
      next();
    }
  );
};

module.exports = { verifyToken };
