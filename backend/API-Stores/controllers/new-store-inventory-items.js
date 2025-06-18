const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const he = require("he");
const jwt = require("jsonwebtoken");

exports.post_new_store_inventory_items = [
  body("storeId").isInt().trim().escape(),
  body("itemName").isLength({ min: 1, max: 30 }).trim().escape(),
  body("itemType").trim().escape(),
  body("itemPrice").isFloat({ min: 0.01 }).toFloat(),
  body("productionDate").isISO8601().trim().escape(),
  body("expirationDate").isISO8601().trim().escape(),
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
          price: req.body.itemPrice,
          productionDate: new Date(req.body.productionDate),
          expirationDate: new Date(req.body.expirationDate),
          createdByUserId: userId,
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
