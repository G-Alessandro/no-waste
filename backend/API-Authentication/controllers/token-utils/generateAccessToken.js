const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
};

module.exports =  generateAccessToken ;
