const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete_user_location = [
  body("userId").isInt().trim().escape(),
  body("locationId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    try {
      handleValidationErrors(req, res);

      const userLocations = await prisma.userLocations.findUnique({
        where: { userId: Number(req.body.userId) },
        include: { location: true },
      });

      const deleteResult = await prisma.location.deleteMany({
        where: {
          id: Number(req.body.locationId),
          userLocationsId: userLocations.id,
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
  }),
];
