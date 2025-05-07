const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.get_stores_list = asyncHandler(async (req, res) => {
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

    const storesList = storesWithItems.map((store) => {
      const items = store.inventory?.items ?? [];
      let freshFoods = [];
      let cannedFoods = [];

      const typeCounts = items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {});

      Object.entries(typeCounts).forEach(([key, value]) => {
        const entry = { key, quantity: value };
        let type = {
          type: entry.key,
          quantity: entry.quantity,
        };

        if (key.startsWith("canned")) {
          cannedFoods.push(type);
        } else {
          freshFoods.push(type);
        }
      });

      const sortFoodsTypeArray = (array) => {
        array.sort((a, b) => a.type.localeCompare(b.type));
      };

      sortFoodsTypeArray(freshFoods);
      sortFoodsTypeArray(cannedFoods);

      return {
        id: store.id,
        name: store.name,
        latitude: store.latitude,
        longitude: store.longitude,
        createdByUserId: store.createdByUserId,
        freshFoods,
        cannedFoods,
      };
    });

    res.status(200).json({ storesList });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for stores" });
  }
});
