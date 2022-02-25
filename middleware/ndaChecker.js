const ndaChecker = (req, res, next) => {
    if (req.user) {
        if (req.user.acceptedNda || req.path.includes('nda') || req.path.includes('auth')) {
            return next();
        }

        return res.redirect('/nda');
    }

    return next();
};

module.exports = ndaChecker;
