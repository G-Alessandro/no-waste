const asyncHandler = require("express-async-handler");
const handleValidationErrors = require("./validation/validation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.refresh_token_post = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);
  try {
    const refreshToken = req.cookies.refreshToken;
    const storedToken = await prisma.refreshToken.findUnique({
      where: { refreshToken },
    });

    if (!storedToken) {
      res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Error validating login data" });

        const storedToken = await prisma.refreshToken.findUnique({
          where: { token: refreshToken },
        });

        if (!storedToken) {
          return res
            .status(403)
            .json({ message: "Login data not found, please log in again" });
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user)
          return res.status(403).json({
            message: "Error validating login data: Account not found",
          });

        const newAccessToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login expired, Please log in again" });
  }
});
