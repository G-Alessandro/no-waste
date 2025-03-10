const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const he = require("he");

exports.post_new_user_location = [
  body("userId").isInt().trim().escape(),
  body("locationName").trim().escape(),
  body("locationLatitude").isFloat().trim().escape(),
  body("locationLongitude").isFloat().trim().escape(),
  asyncHandler(async (req, res) => {
    try {
      handleValidationErrors(req, res);

      let userLocation = await prisma.userLocation.findUnique({
        where: {
          userId: Number(req.body.userId),
        },
      });

      if (!userLocation) {
        userLocation = await prisma.userLocation.create({
          data: { userId: Number(req.body.userId) },
        });
      }

      const newLocation = await prisma.location.create({
        data: {
          name: he.decode(req.body.locationName),
          latitude: parseFloat(req.body.locationLatitude),
          longitude: parseFloat(req.body.locationLongitude),
          userLocationsId: userLocation.id,
        },
      });

      res.status(201).json({ message: "New location saved" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the new location" });
    }
  }),
];
