const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const {
  setupProxy,
  handleNotFound,
} = require("./middleware/proxy");
require("dotenv").config();

const { services } = require("./services/index");
const allowedFrontendOrigin = process.env.ALLOWED_FRONTEND_ORIGIN;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedFrontendOrigin,
    credentials: true,
  })
);
app.use(helmet());
app.disable("x-powered-by");


setupProxy(app, services);
app.use(handleNotFound);
module.exports = app;
