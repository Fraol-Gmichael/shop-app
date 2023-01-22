const router = require("express").Router();
const checkAuth = require("../../middleware/check-auth");

const { json } = require("body-parser");
const ordersController = require("../../controllers/orders");

router.get("/:orderID", checkAuth, ordersController.fetch_single_order);

router.get("/", checkAuth, ordersController.fetch_all_orders);

router.delete("/:orderID", checkAuth, ordersController.delete_single_order);

router.post("/", checkAuth, ordersController.add_order);

module.exports = router;
