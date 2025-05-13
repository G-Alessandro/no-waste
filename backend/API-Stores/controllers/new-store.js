const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const he = require("he");
const jwt = require("jsonwebtoken");

exports.post_new_store = [
  body("storeName").isLength({ min: 1, max: 30 }).trim().escape(),
  body("latitude").isFloat().trim().escape(),
  body("longitude").isFloat().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(403).json({
        message:
          "Unauthorized deletion, you must log in to access this feature",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {

      const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedJwt.userId;

      await prisma.store.create({
        data: {
          name: he.decode(req.body.storeName),
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          createdByUserId: userId,
        },
      });
      res.status(201).json({ message: "The new store has been added" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the new store" });
    }
  }),
];
