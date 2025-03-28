const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
};

exports.login_post = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const { email, password } = req.body;
      const user = await prisma.userAccount.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res
          .status(401)
          .json({ error: "Account does not exist or incorrect email" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Login failed" });
    }
  }),
];
