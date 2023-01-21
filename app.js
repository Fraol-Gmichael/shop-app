const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const app = express();

// Connect to mongodb using mongoose
mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://abule:jFNiO9LznHkPcIhL@rest-shop.zqtequw.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB😍😍😍");
  }
);

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle cors errors
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.json({});
  }
  next();
});

// Handling cors easy way
app.use(
  cors({
    origin: "*",
  })
);

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Raise an error at the end
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;