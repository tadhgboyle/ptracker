const sectionChecker = (req, res, next) => {
    if (req.user) {
        if (req.path.includes('auth') || req.path.includes('pendingSection') || req.path.includes('nda')) {
            return next();
        }

        if (req.user.section.id === 1 && req.user.role !== 'ADMIN') {
            return res.redirect('/pendingSection');
        }
    }

    return next();
};

module.exports = sectionChecker;
