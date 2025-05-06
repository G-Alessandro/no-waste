const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const seedStores = require("./seeds/stores.js");
const seedInventories = require("./seeds/inventories.js");
const seedItems = require("./seeds/items.js");

async function main() {
  await seedStores(prisma);
  await seedInventories(prisma);
  await seedItems(prisma);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
