const ndaChecker = (req, res, next) => {
    if (!req.user || req.user.acceptedNda || req.path.includes('nda') || req.path.includes('auth')) {
        return next();
    } else {
        return res.redirect('/nda');
    }
};

module.exports = ndaChecker;
