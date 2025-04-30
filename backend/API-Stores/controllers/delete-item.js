const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.delete_item = [
  body("itemId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(403).json({
        message:
          "Unauthorized deletion, you must log in to access this feature",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const deletedItem = await prisma.item.deleteMany({
        where: {
          id: Number(req.body.userId),
          createdByUserId: decodedJwt.userId,
        },
      });

      if (deletedItem.count === 0) {
        res.status(404).json({
          message: "Item not found or you do not have permission to delete it",
        });
      }

      res.status(200).json({ message: "Item successfully deleted" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the item" });
    }
  }),
];
