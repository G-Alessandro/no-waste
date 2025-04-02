const jwt = require("jsonwebtoken");

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await fetch(
      `${process.env.AUTHENTICATION_SERVICES}/refresh-token`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );
    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    req.headers["authorization"] = `Bearer ${newAccessToken}`;
    next();
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    res.status(403).json({
      message: "Access denied, you must log in to access this feature",
    });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Login data expired, trying to refresh...");
      return await refreshAccessToken(req, res, next);
    }
    res.status(401).json({ message: "Invalid login data" });
  }
};

module.exports = { verifyToken };
