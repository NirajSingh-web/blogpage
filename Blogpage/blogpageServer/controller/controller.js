const jwt = require("jsonwebtoken");
const confiq = require("./../envConfiq");
const jwtsecret = confiq.jwtSecret;
const fetchuser = (req, res, next) => {
  try {
    if (req.header) {
      const token = req.header("auth-token");
      if (!token) {
        res.status(401).json("invalid Token");
      }
      if (token) {
        const data = jwt.verify(token, jwtsecret);
        req.users = data;
        next();
      }
    }
  } catch (e) {
    console.log(e.message);
    res.status(401).json("Internal issue");
  }
};
module.exports = { fetchuser };
