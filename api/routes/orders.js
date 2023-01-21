const mongoose = require("mongoose");
const router = require("express").Router();
const Order = require("../models/orders");
const Product = require("../models/products");

const { json } = require("body-parser");

router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.findById(id)
    .select("_id quantity product")
    .populate("product")

    .exec()
    .then((result) => {
      if (result) {
        res.json({
          order: result,
        });
      } else {
        res.status(404).json({
          error: "Order not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        orders: result.map((doc) => {
          return {
            order: doc,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${doc._id}`,
            },
          };
        }),
      };
      res.json({
        response: response,
      });
    })
    .catch((err) => {
      json.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.json({
        message: "Deleting succeded",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/",
          body: {
            quantity: "Number",
            product: "String",
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

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId).then((result) => {
    if (result) {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      order
        .save()
        .then((result) => {
          res.json({
            message: "Adding an order succeded",

            order: {
              _id: result._id,
              quantity: result.quantity,
              product: result.productId,
            },
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${result._id}`,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      res.status(404).json({
        error: "Product not found",
      });
    }
  });
});

module.exports = router;
