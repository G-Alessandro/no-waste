const validateRequest = (req, res, next) => {
  if (req.path.startsWith("/registration") && req.method === "POST") {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  }

  if (req.path.startsWith("/login")) {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
  }
  next();
};

module.exports = { validateRequest };
