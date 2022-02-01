module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.user) {
        return next();
    }

    return res.status(401).json({
        message: 'You are not authenticated'
      });
  },

  ensureAuthenticated: (req, res, next) => {
    return req.isAuthenticated()
        ? next()
        : res.redirect('/auth/login');
  },

  forwardAuthenticated: (req, res, next) => {
    return !req.isAuthenticated()
        ? next()
        : res.redirect('/homepage');
  },
};
