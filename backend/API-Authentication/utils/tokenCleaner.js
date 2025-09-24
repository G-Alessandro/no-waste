const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const deleteExpiredTokens = async () => {
  try {
    const now = new Date();
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    const deletedBlackListedTokens = await prisma.blacklistedRefreshToken.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    if (deletedTokens.count > 0) {
      console.log(`Removed ${deletedTokens.count} expired tokens.`);
    }

    if (deletedBlackListedTokens.count > 0) {
      console.log(
        `Removed ${deletedBlackListedTokens.count} expired black listed tokens.`
      );
    }
  } catch (error) {
    console.error("Error clearing expired tokens:", error);
  }
};

const startExpiredTokensCleanup = () => {
  console.log("Running initial cleanup of expired tokens...");
  deleteExpiredTokens();
  cron.schedule("0 0 * * *", async () => {
    console.log("Start cleaning expired tokens...");
    await deleteExpiredTokens();
  });

  console.log("Cron job active: clean expired tokens every day at midnight..");
};

module.exports = { startExpiredTokensCleanup };
