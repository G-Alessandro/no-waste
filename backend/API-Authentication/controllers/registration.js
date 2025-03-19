const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.registration_post = [
  body("firstName", "First name must not be empty.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("lastName", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const user = await prisma.userAccount.findUnique({
        where: { email: value },
      });
      if (user) {
        throw new Error("email is already in use");
      }
    }),
  body("confirmEmail", "Confirm email must match email.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.email) {
        throw new Error("emails do not match");
      }
      return true;
    }),
  body("password", "Password name must not be empty.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("confirmPassword", "Confirm password must match password.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords do not match");
      }
      return true;
    }),

  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await prisma.userAccount.create({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
        },
      });

      res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).send("An error occurred while processing the request.");
    }
  }),
];
