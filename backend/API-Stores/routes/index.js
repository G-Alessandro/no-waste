const express = require("express");
const router = express.Router();
const get_stores_list_controller = require("../controllers/get-stores-list.js");
const get_items_list_controller = require("../controllers/get-items-list.js");
const new_store_inventory_items_controller = require("../controllers/new-store-inventory-items.js");
const new_store_controller = require("../controllers/new-store.js");
const delete_store_controller = require("../controllers/delete-store.js");
const delete_item_controller = require("../controllers/delete-item.js");

router.get("/stores-list", get_stores_list_controller.get_stores_list);

router.get("/items-list/:storeId", get_items_list_controller.get_items_list);

router.post(
  "/new-store-inventory-items",
  new_store_inventory_items_controller.post_new_store_inventory_items
);

router.post("/new-store", new_store_controller.post_new_store);

router.delete("/delete-store", delete_store_controller.delete_store);

router.delete("/delete-item", delete_item_controller.delete_item);

module.exports = router;
