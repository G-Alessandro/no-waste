const express = require("express");
const router = express.Router();
const user_locations_controller = require("../controllers/user-locations.js");
const new_user_location_controller = require("../controllers/new-user-location.js");
const delete_user_location_controller = require("../controllers/delete-user-location.js");

router.get("/user-locations", user_locations_controller.get_user_locations);

router.post(
  "/new-user-location",
  new_user_location_controller.post_new_user_location
);

router.delete(
  "/delete-user-location",
  delete_user_location_controller.delete_user_location
);

module.exports = router;
