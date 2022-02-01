const URL = 'http://localhost:3000';

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
        : res.redirect(`${URL}/login`);
  },

  forwardAuthenticated: (req, res, next) => {
    return !req.isAuthenticated()
        ? next()
        : res.redirect('/reminders');
},

};
