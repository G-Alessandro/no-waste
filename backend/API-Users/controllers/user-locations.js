const handleValidationErrors = require("./validation/validation.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.get_user_locations = async (req, res) => {
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

    let userLocations = await prisma.userLocations.findUnique({
      where: {
        userId: userId,
      },
      include: {
        location: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            createdByUserId: true,
          },
        },
      },
    });

    userLocations = userLocations?.location;

    res.status(200).json({ userLocations });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while searching for saved locations",
    });
  }
};
