const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "User created successfully",
              user: result,
            });
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      });
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth failed" });
      }
      bcrypt.compare(req.body.password, user.password, (err, matched) => {
        if (err) {
          return res.status(401).json({ message: "Auth failed" });
        }
        if (matched) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
          return res.json({
            message: "User successfully logged in",
            token: token,
          });
        } else {
          return res.status(401).json({ message: "Auth failed" });
        }
      });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json(users);
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

module.exports = router;
