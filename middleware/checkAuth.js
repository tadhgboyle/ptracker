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
        if (req.user.isInstructor()) {
            return next();
        }

        return res.status(401).json({
            message: 'You are not authorized'
        });
    },

    isAdmin: (req, res, next) => {
        if (req.user.isAdmin()) {
            return next();
        }

        return res.status(401).json({
            message: 'You are not authorized'
        });
    },

    ensureAuthenticated: (req, res, next) => {
        return req.isAuthenticated()
            ? next()
            : res.redirect('/auth/login');
    },

    forwardIfAuthenticated: (req, res, next) => {
        return !req.isAuthenticated()
            ? next()
            : res.redirect('/dashboard');
    },
};
