const jwt = require("jsonwebtoken");

const refreshAccessToken = async (req, res, next) => {
  try {
    
    const response = await fetch(
      `${process.env.AUTHENTICATION_SERVICES}/refresh-token`,
      {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${req.cookies.refreshToken}`,
        },
      }
    );

    const data = await response.json();

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    if (response.ok && data?.accessToken) {
      req.headers["authorization"] = data.accessToken;
      res.setHeader("Authorization", data.accessToken);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
    }

    return next();
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

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({
      message: "Access denied, you must log in to access this feature",
    });

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Access token expired, refreshing...");

      return refreshAccessToken(req, res, next);
    }

    return res.status(401).json({ error: "Invalid login data" });
  }
};

module.exports = { verifyToken };
