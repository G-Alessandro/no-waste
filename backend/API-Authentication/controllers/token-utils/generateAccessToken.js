const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
};

module.exports =  generateAccessToken ;
