module.exports = async function seedInventories(prisma) {
  const storeIds = [1, 2, 3];

  await Promise.all(
    storeIds.map((storeId) => {
      return prisma.inventory.upsert({
        where: { storeId },
        update: {},
        create: {
          storeId,
        },
      });
    })
  );
};
