const Role = require('../models/role');

module.exports.isInstructor = (req, res, next) => {
    if (req.user &&
        (req.user.role === Role.INSTRUCTOR || req.user.role === Role.ADMIN)
    ) {
        return next();
    }

    return res.status(401).json({
        message: 'You are not authenticated'
    });
};
