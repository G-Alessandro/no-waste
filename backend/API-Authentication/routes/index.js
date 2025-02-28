const express = require("express");
const router = express.Router();
const login_controllers = require("./controllers/login.js");
const registration_controllers = require("./controllers/registration.js");
const demo_account_controllers = require("./controllers/demo-account.js");

router.post("/login", login_controllers.login_post);

router.post("/registration", registration_controllers.registration_post);

router.get("/demo-account", demo_account_controllers.demo_account_get);
