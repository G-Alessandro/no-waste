const asyncHandler = require("express-async-handler");
const handleValidationErrors = require("./validation/validation");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("./token-utils/generateAccessToken");
const generateRefreshToken = require("./token-utils/generateRefreshToken");

exports.refresh_token_post = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ error: "Invalid access, please login" });
    }

    const decodedJwt = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    const accessToken = generateAccessToken(decodedJwt.userId);
    const refreshToken = await generateRefreshToken(
      decodedJwt.userId,
      oldRefreshToken
    );

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .clearCookie("refreshToken")
        .json({ error: "Access no longer valid, please login" });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(403)
        .clearCookie("refreshToken")
        .json({ error: "Invalid access, please login" });
    }

    res.status(500).json({ error: "internal server error" });
  }
});
