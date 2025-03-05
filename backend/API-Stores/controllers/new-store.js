const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.post_new_store = [
  body("storeName").isLength({ min: 1, max: 30 }).trim().escape(),
  body("latitude").isFloat().trim().escape(),
  body("longitude").isFloat().trim().escape(),
  body("userId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const newStore = await prisma.store.create({
        data: {
          name: req.body.storeName,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          createdByUserId: Number(req.body.userId),
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
