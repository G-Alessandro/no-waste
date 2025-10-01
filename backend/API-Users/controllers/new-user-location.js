const { body } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const he = require("he");

exports.post_new_user_location = [
  body("locationName").trim().escape(),
  body("locationLatitude").isFloat().trim().escape(),
  body("locationLongitude").isFloat().trim().escape(),
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

      let userLocation = await prisma.userLocations.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!userLocation) {
        userLocation = await prisma.userLocations.create({
          data: { userId: userId },
        });
      }

      await prisma.location.create({
        data: {
          name: he.decode(req.body.locationName),
          latitude: parseFloat(req.body.locationLatitude),
          longitude: parseFloat(req.body.locationLongitude),
          userLocationsId: userLocation.id,
          createdByUserId: userId,
        },
      });

      res.status(201).json({ message: "New location saved" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the new location" });
    }
  },
];
