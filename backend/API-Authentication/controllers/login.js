const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./utils/validation/validation");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

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
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2h",
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }),
];
