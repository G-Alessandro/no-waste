const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  await prisma.refreshToken.deleteMany({
    where: { userId: userId },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
};

module.exports = generateRefreshToken;
