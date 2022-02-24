const Role = require('../models/role');

const ndaChecker = (req, res, next) => {
    if (req.user) {
        if (req.user.section.id === 1 && req.user.role === Role.STUDENT) {
            res.render('pendingSection', {
                page: 'assign',
            });
        }
        else if (req.user.acceptedNda || req.path.includes('nda') || req.path.includes('auth')) {
            return next();
        } else {
            return res.redirect('/nda');
        }
    } else {
        return next();
    }
};

module.exports = ndaChecker;
