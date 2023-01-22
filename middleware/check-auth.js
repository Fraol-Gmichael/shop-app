const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedData = jwt.verify(token, process.env.SECRET);
    req.userData = decodedData;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      error: err,
    });
  }
};
