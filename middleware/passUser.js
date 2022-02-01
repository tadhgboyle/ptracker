const passUser = (req, res, next) => {
    // This function is used so in ejs pages, you can get the user's information from this page instead of having to pass req.user everytime
    res.locals.user = req.user;
    next();
};

module.exports = passUser;