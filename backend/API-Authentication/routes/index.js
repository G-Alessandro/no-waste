const express = require("express");
const router = express.Router();
const login_controllers = require("../controllers/login.js");
const registration_controllers = require("../controllers/registration.js");
const refresh_token_controllers = require("../controllers/refreshToken.js");
const demo_account_controllers = require("../controllers/demo-account.js");
const logout_controllers = require("../controllers/logout.js");

router.post("/login", login_controllers.login_post);

router.post("/registration", registration_controllers.registration_post);

router.post("/refresh-token", refresh_token_controllers.refresh_token_post);

router.get("/demo-account", demo_account_controllers.demo_account_get);

router.post("/logout", logout_controllers.logout_post);