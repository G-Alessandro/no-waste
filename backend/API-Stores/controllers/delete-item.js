const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete_item = [
  body("userId").isInt().trim().escape(),
  body("itemId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const deletedItem = await prisma.item.deleteMany({
        where: {
          id: Number(req.body.userId),
          createdByUserId: Number(req.body.itemId),
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
