const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.delete_user_location = [
  body("locationId").isInt().trim().escape(),
  async (req, res) => {
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
      const userId = decodedJwt.userId;

      const userLocations = await prisma.userLocations.findUnique({
        where: { userId: userId },
        include: { location: true },
      });

      const deleteResult = await prisma.location.deleteMany({
        where: {
          id: Number(req.body.locationId),
          userLocationsId: userLocations.id,
          createdByUserId: userId,
        },
      });

      if (userLocations.location.length === 1 && deleteResult.count === 1) {
        await prisma.userLocations.delete({
          where: {
            id: userLocations.id,
          },
        });
      }

      res.status(200).json({ message: "Location deleted" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the location" });
    }
  },
];
