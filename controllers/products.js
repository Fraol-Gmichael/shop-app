const mongoose = require("mongoose");
const Product = require("../api/models/products");

exports.fetch_all_products = (req, res, next) => {
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
};

exports.fetch_single_product = (req, res, next) => {
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
};

exports.add_product = (req, res, next) => {
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
};

exports.edit_single_product = (req, res, next) => {
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
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_single_product = (req, res, next) => {
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
};
