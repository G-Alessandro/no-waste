const asyncHandler = require("express-async-handler");
const handleValidationErrors = require("./validation/validation");
const prisma = new PrismaClient();

exports.logout_post = asyncHandler(async (req, res) => {
  handleValidationErrors(req, res);
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Login data not found" });
    }

    const deletedToken = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (deletedToken.count === 0) {
      return res.status(403).json({ message: "Invalid login data" });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while logging out" });
  }
});
