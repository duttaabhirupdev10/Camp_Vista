module.exports.isRole = (...roles) => {
    return (req, res, next) => {

        // User must be logged in
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }

        // Check user's role
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).send('Access Denied: You do not have permission.');
        }

        next();
    };
};