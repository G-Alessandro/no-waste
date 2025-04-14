const asyncHandler = require("express-async-handler");
const handleValidationErrors = require("./validation/validation");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.logout_post = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);
  try {
    const accessToken = req.body.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "Login data not found" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    const deletedToken = await prisma.refreshToken.deleteMany({
      where: { userId: decoded.userId },
    });

    if (deletedToken.count === 0) {
      res.status(403).json({ message: "Invalid login data" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while logging out" });
  }
});
