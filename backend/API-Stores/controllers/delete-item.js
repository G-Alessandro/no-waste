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

    let accessToken = req.headers["authorization"];

    if (!accessToken) {
      res.status(403).json({
        message: "Access denied, you must log in to access this feature",
      });
    }
    if (accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.split(" ")[1];
    }

    try {
      const decodedJwt = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      const userId = decodedJwt.userId;

      const deletedItem = await prisma.item.delete({
        where: {
          id: Number(req.body.itemId),
          createdByUserId: userId,
        },
      });

      const itemInventory = await prisma.inventory.findUnique({
        where: {
          id: deletedItem.inventoryId,
        },
        include: {
          _count: {
            select: { items: true },
          },
        },
      });

      if (itemInventory._count.items === 0) {
        await prisma.inventory.delete({
          where: {
            id: itemInventory.id,
          },
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
