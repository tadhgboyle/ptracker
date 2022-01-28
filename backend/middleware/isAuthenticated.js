module.exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
      return next();
  }

  return res.status(401).json({
      message: 'You are not authenticated'
  });
};
