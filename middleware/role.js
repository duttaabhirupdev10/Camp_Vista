module.exports.isRole = (...roles) => {
    return (req, res, next) => {
        // User must be logged in
        if (!res.locals.currentUser) {
            return res.redirect('/');
        }

        // Check user's role
        if (!roles.includes(res.locals.currentUser.role)) {
            return res.status(403).send('Access Denied: You do not have permission.');
        }

        next();
    };
};