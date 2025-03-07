const asyncHandler = require("express-async-handler");
const { param } = require("express-validator");
const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.get_user_location = [
  param("userId").isInt().trim().escape(),
  asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);
    try {
      const userLocations = await prisma.userLocations.findMany({
        where: {
          userId: Number(req.params.userId),
        },
        include: {
          location: true,
        },
      });

      res.status(200).json({ userLocations });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          error: "An error occurred while searching for saved locations",
        });
    }
  }),
];
