const express = require("express");
const multer = require("multer");
const router = express.Router();
const checkAuth = require("../../middleware/check-auth");
const productsController = require("../../controllers/products");
const { upload } = require("../../controllers/image_upload");

router.get("/", checkAuth, productsController.fetch_all_products);

router.get("/:productId", checkAuth, productsController.fetch_single_product);
router.post("/", checkAuth, upload.single("productImage"), productsController.add_product);

router.patch("/:productId", checkAuth, productsController.edit_single_product);
router.delete("/:productId", checkAuth, productsController.delete_single_product);

module.exports = router;
