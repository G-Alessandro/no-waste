const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const { startExpiredTokensCleanup } = require("./utils/tokenCleaner");
const verifyGatewaySecret = require("./middleware/verifyGatewaySecret");
require("dotenv").config();

const indexRouter = require("./routes/index");

const app = express();

app.set("trust proxy", true);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use("/authentication", verifyGatewaySecret);

app.use("/", indexRouter);

startExpiredTokensCleanup();

module.exports = app;
