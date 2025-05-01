const express = require("express");
const router = express.Router();
const get_stores_inventory_controller = require("../controllers/get-stores-inventory.js");
const get_items_list_controller = require("../controllers/get-items-list.js");
const new_store_inventory_items_controller = require("../controllers/new-store-inventory-items.js");
const new_store_controller = require("../controllers/new-store.js");
const delete_store_controller = require("../controllers/delete-store.js");
const delete_item_controller = require("../controllers/delete-item.js");

router.get(
  "/stores-inventory",
  get_stores_inventory_controller.get_stores_inventory
);

router.get("/items-list/:id", get_items_list_controller.get_items_list);

router.post(
  "/new-store-inventory-items",
  new_store_inventory_items_controller.post_new_store_inventory_items
);

router.post("/new-store", new_store_controller.post_new_store);

router.delete("/delete-store/:id", delete_store_controller.delete_store);

router.delete("/delete-item/:id", delete_item_controller.delete_item);

module.exports = router;
