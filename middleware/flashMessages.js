const flashMessages = (req, res, next) => {
    if (req.session.success_message) {
        res.locals.success_message = req.session.success_message;
        delete req.session.success_message;
    }
    if (req.session.error_message) {
        res.locals.error_message = req.session.error_message;
        res.locals.error_perm = req.session.error_perm;
        delete req.session.error_message;
        delete req.session.error_perm;
    }
    next();
};

module.exports = flashMessages;
