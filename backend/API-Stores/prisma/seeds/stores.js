module.exports = async function seedStores(prisma) {
  const stores = [
    {
      name: "Liraspin",
      latitude: 41.9028,
      longitude: 12.4964,
    },
    { name: "Co-op", latitude: 41.9028, longitude: 12.4964 },
    { name: "Carrefive", latitude: 41.9028, longitude: 12.4964 },
  ];

  await Promise.all(
    stores.map((store) => {
      const createdByUserId = 35;
      return prisma.store.upsert({
        where: { name: store.name },
        update: {},
        create: {
          name: store.name,
          latitude: store.latitude,
          longitude: store.longitude,
          createdByUserId,
        },
      });
    })
  );
};
