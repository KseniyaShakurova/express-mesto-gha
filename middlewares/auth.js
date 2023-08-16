const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, 'secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
