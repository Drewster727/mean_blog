module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated request');
    return next();
  }
  console.log('non-authenticated request');
  res.redirect('/login');
};
