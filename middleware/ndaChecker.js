const ndaChecker = (req, res, next) => {
    console.log(req.user);
    if (!req.user || req.user.acceptedNda || req.path.includes('nda') || req.path.includes('auth')) {
        return next();
    } else {
        req.session.error_message = 'You must accept the NDA to continue.';
        req.session.error_perm = true;

        return res.render('nda', {
            page: 'NDA',
        });
    }
};

module.exports = ndaChecker;
