const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { startExpiredTokensCleanup } = require("./utils/tokenCleaner");
require("dotenv").config();

const indexRouter = require("./routes/index");
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use("/", indexRouter);

startExpiredTokensCleanup();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Authentication is running on port ${PORT}`);
});

module.exports = app;
