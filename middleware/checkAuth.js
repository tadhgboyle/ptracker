const Role = require('../models/role');

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.user) {
        return next();
    }

    return res.status(401).json({
        message: 'You are not authenticated'
      });
  },

  isInstructor: (req, res, next) => {
    if (req.user.role === Role.INSTRUCTOR || req.user.role === Role.ADMIN) {
        return next();
    }

    return res.status(401).json({
        message: 'You are not authorized to perform this action'
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
