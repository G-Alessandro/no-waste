const asyncHandler = require("express-async-handler");
const handleValidationErrors = require("./validation/validation");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateAccessToken = require("./token-utils/generateAccessToken");
const generateRefreshToken = require("./token-utils/generateRefreshToken");

exports.demo_account_get = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);
  try {
    const { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } = process.env;

    const user = await prisma.userAccount.findUnique({
      where: { email: DEMO_ACCOUNT_EMAIL },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Account does not exist or incorrect email" });
    }

    const passwordMatch = await bcrypt.compare(
      DEMO_ACCOUNT_PASSWORD,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

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
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});
