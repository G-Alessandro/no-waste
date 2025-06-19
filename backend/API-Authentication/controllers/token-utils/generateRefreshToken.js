const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const generateRefreshToken = async (userId, oldToken) => {
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );

  if (oldToken) {
    const oldRefreshTokens = await prisma.refreshToken.findUnique({
      where: {
        token: oldToken,
      },
    });

    if (oldRefreshTokens) {
      await prisma.blacklistedRefreshToken.create({
        data: {
          token: oldRefreshTokens.token,
          blacklistedAt: new Date(),
          expiresAt: oldRefreshTokens.expiresAt,
        },
      });
    }
  }

  await prisma.refreshToken.deleteMany({
    where: { userId: userId },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
};

module.exports = generateRefreshToken;
