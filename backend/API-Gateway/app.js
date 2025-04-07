const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const {
  rateLimitAndTimeout,
  setupProxy,
  handleNotFound,
} = require("./middleware/proxy");
require("dotenv").config();

const { services } = require("./services/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.disable("x-powered-by");

app.use(rateLimitAndTimeout);

setupProxy(app, services);
app.use(handleNotFound);

module.exports = app;
