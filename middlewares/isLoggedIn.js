const appErr = require('../utils/appErr');

const isLoggedIn = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.userAuth) next(appErr('Not authorized, login again'));
  next();
};

module.exports = isLoggedIn;
