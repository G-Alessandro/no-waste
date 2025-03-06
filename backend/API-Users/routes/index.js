const express = require("express");
const router = express.Router();
const user_location_controller = require("../controllers/user-location.js");
const new_user_location_controller = require("../controllers/new-user-location.js");
const delete_user_location_controller = require("../controllers/delete-user-location.js");

router.get("/user-location", user_location_controller.get_user_location);

router.post(
  "/new-user-location",
  new_user_location_controller.post_new_user_location
);

router.delete(
  "/delete-user-location",
  delete_user_location_controller.delete_user_location
);

module.exports = router;
