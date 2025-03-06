const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.get_stores_inventory = asyncHandler(async (req, res) => {
  try {
    const storesWithInventoryAndItems = await prisma.store.findMany({
      include: {
        inventory: {
          include: {
            items: true,
          },
        },
      },
    });
    res.status(200).json({ storesWithInventoryAndItems });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for stores" });
  }
});
