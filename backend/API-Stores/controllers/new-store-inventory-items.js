const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.post_store_inventory_items = [
  body("itemName").isLength({ min: 1, max: 30 }).trim.escape(),
  body("itemType").trim().escape(),
  body("productionDate").isISO8601().trim.escape(),
  body("expirationDate").isISO8601().trim.escape(),
  body("inventoryId").isInt().trim().escape(),
  body("userId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const newItem = await prisma.item.create({
        data: {
          inventoryId: Number(req.body.inventoryId),
          name: req.body.itemName,
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
