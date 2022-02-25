const sectionChecker = (req, res, next) => {
    if (req.user) {
        if (req.path.includes('auth') || req.path.includes('pendingSection')) {
            return next();
        }

        if (req.user.section.id === 1) {
            return res.redirect('/pendingSection');
        }
    }

    return next();
};

module.exports = sectionChecker;
