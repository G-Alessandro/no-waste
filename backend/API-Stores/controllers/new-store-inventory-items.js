const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const he = require("he");

exports.post_new_store_inventory_items = [
  body("userId").isInt().trim().escape(),
  body("storeId").isInt().trim().escape(),
  body("itemName").isLength({ min: 1, max: 30 }).trim().escape(),
  body("itemType").trim().escape(),
  body("productionDate").isISO8601().trim().escape(),
  body("expirationDate").isISO8601().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      let inventory = await prisma.inventory.findUnique({
        where: { storeId: Number(req.body.storeId) },
      });

      if (!inventory) {
        inventory = await prisma.inventory.create({
          data: { storeId: Number(req.body.storeId) },
        });
      }

      const newItem = await prisma.item.create({
        data: {
          inventoryId: inventory.id,
          name: he.decode(req.body.itemName),
          type: req.body.itemType,
          productionDate: new Date(req.body.productionDate),
          expirationDate: new Date(req.body.expirationDate),
          createdByUserId: Number(req.body.userId),
        },
      });

      res.status(201).json({ message: "New item added" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the new item" });
    }
  }),
];
