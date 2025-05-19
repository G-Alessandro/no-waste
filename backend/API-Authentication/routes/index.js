const express = require("express");
const router = express.Router();
const login_controller = require("../controllers/login.js");
const registration_controller = require("../controllers/registration.js");
const refresh_token_controller = require("../controllers/refreshToken.js");
const demo_account_controller = require("../controllers/demo-account.js");
const user_data_controller = require("../controllers/userData.js");
const logout_controller = require("../controllers/logout.js");

router.post("/login", login_controller.login_post);

router.post("/registration", registration_controller.registration_post);

router.post("/refresh-token", refresh_token_controller.refresh_token_post);

router.get("/demo-account", demo_account_controller.demo_account_get);

router.get("/user-data", user_data_controller.user_data_get);

router.post("/logout", logout_controller.logout_post);

module.exports = router;