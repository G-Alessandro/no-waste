const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateAccessToken = require("./token-utils/generateAccessToken");
const generateRefreshToken = require("./token-utils/generateRefreshToken");

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
  async (req, res) => {
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
  },
];
