const asyncHandler = require("express-async-handler");
const { param } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.get_items_list = [
  param("storeId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const inventoryId = await prisma.inventory.findUnique({
        where: { storeId: Number(req.params.storeId) },
        select: {
          id: true,
        },
      });

      if (!inventoryId) {
        return res.status(200).json({
          itemsList: [],
        });
      }

      const items = await prisma.item.findMany({
        where: { inventoryId: inventoryId.id },
        select: {
          id: true,
          name: true,
          type: true,
          productionDate: true,
          expirationDate: true,
          price: true,
          createdByUserId: true,
        },
      });

      const itemsList = items.map((item) => {
        const daysRemaining = Math.round(
          (new Date(item.expirationDate) - new Date(item.productionDate)) /
            (1000 * 60 * 60 * 24)
        );
        const newPrice = item.price.toFixed(2);
        const newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + daysRemaining);

        const { productionDate, expirationDate, price, ...rest } = item;

        return {
          ...rest,
          daysRemaining,
          expirationDate: newExpirationDate,
          price: newPrice,
        };
      });

      res.status(200).json({ itemsList });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while searching for stores" });
    }
  }),
];
