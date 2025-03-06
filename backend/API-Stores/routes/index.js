const express = require("express");
const router = express.Router();
const stores_inventory_controller = require("../controllers/store-inventory.js");
const store_inventory_items_controller = require("../controllers/store-inventory-items.js");
const new_store_controller = require("../controllers/new-store.js");
const delete_store_controller = require("../controllers/store.js");
const delete_item_controller = require("../controller/delete-item.js");

router.get(
  "/stores-inventory",
  stores_inventory_controller.get_stores_inventory
);

router.post(
  "/new-store-inventory-items",
  store_inventory_items_controller.post_store_inventory_items
);

router.post("/new-store", new_store_controller.post_new_store);

router.delete("/delete-store", delete_store_controller.delete_store);

router.delete("/delete-item", delete_item_controller.delete_item);

module.exports = router;
