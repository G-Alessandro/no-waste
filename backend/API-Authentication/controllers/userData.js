const handleValidationErrors = require("./validation/validation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.user_data_get = async (req, res) => {
  handleValidationErrors(req, res);

  let accessToken = req.headers["authorization"];

  if (!accessToken) {
    res.status(403).json({
      message: "Access denied, you must log in to access this feature",
    });
  }
  if (accessToken.startsWith("Bearer ")) {
    accessToken = accessToken.split(" ")[1];
  }
  try {
    const decodedJwt = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    const userData = await prisma.userAccount.findUnique({
      where: { id: decodedJwt.userId },
      select: {
        firstName: true,
        lastName: true,
        id: true,
      },
    });

    if (!userData) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ userData });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
