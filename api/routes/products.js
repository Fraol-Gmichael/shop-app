const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Product = require("../models/products");
const { json } = require("body-parser");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

multer({ dest: "./uploads/" });
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 7,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/",
            },
          };
        }),
      };
      res.json({
        message: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.json(doc);
      } else {
        res.status(404).json({
          error: "Not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST request to /products",
        product: {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
          },
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${product._id}`,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const data = req.body;

  Product.updateOne(
    {
      _id: id,
    },
    data
  )
    .exec()
    .then((result) => {
      res.json({
        message: `Product updated successfully`,
        product: {
          product: {
            _id: result._id,
            name: result.name,
            price: result.price,
          },
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.json({
        message: `product deleted successfully`,
        request: {
          type: "POST",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
