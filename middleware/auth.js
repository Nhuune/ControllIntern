const jwt = require("jsonwebtoken");
require('dotenv').config();
const access_token_secret = serverConfig.ACCESS_TOKEN_SECRET;

const requireAuth = async (req, res, next) => {
  const token = req.headers.jwt;
  if (token) {
    jwt.verify(
      token,
      access_token_secret,
      async (err, decodedToken) => {
        if (err) {
          res.status(401).json({
            message: `token expired, please login again`,
          });
        } else {
          req.user = {
            email: decodedToken.email,
            role: decodedToken.role,
          }
          next();
        }
      }
    );
  } else {
    res.status(401).json({
      message: `Token invalid`,
    });
  }
};

module.exports = { requireAuth };