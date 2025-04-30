const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.delete_store = [
  body("storeId").isInt().trim().escape(),
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
      const userId = decodedJwt.userId;

      const findStore = await prisma.store.findUnique({
        where: {
          id: Number(req.body.storeId),
          createdByUserId: userId,
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
