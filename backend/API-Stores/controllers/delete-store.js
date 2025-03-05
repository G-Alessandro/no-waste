const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete_store = [
  body("userId").isInt().trim().escape(),
  body("storeId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const userId = Number(req.body.userId);
      const storeId = Number(req.body.storeId);

      const findStore = await prisma.store.findUnique({
        where: {
          id: storeId,
        },
      });

      if (findStore.createdByUserId !== userId) {
        res.status(403).json({
          message:
            "You do not have the necessary permission to delete the store",
        });
      }

      const findInventory = await prisma.inventory.findUnique({
        where: {
          storeId: storeId,
        },
      });

      await prisma.item.deleteMany({
        where: { inventoryId: findInventory.id },
      });

      await prisma.inventory.delete({
        where: {
          storeId: storeId,
        },
      });

      await prisma.store.delete({
        where: {
          id: storeId,
        },
      });

      res.status(200).json({ message: "Store successfully removed" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the store" });
    }
  }),
];
