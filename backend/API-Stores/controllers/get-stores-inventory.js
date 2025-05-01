const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.get_stores_inventory = asyncHandler(async (req, res) => {
  try {
    const storesWithItems = await prisma.store.findMany({
      include: {
        inventory: {
          include: {
            items: {
              select: {
                type: true,
              },
            },
          },
        },
      },
    });

    const result = storesWithItems.map((store) => {
      const items = store.inventory?.items ?? [];

      const typeCounts = items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {});

      return {
        id: store.id,
        name: store.name,
        latitude: store.latitude,
        longitude: store.longitude,
        createdByUserId: store.createdByUserId,
        itemsByType: typeCounts,
      };
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for stores" });
  }
});
