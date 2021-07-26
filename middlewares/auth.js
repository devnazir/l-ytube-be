const jwt = require("jsonwebtoken");
const CONSTANT = require("../constant");

const authMiddleware = (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: `${CONSTANT.HAS_NOT_LOGGED}`,
    });
  }

  jwt.verify(token, req.app.get("jwt-secret"), (err, decode) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    req.decode = decode;
    next();
  });
};

module.exports = authMiddleware;
