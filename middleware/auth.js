function isLoggedIn(req, res, next) {
    if (!req.auth || !req.auth.userId) {
        // Clerk handles redirecting to login, but we can safely bounce them back home or to a login route
        return res.redirect("/");
    }
    next();
}

module.exports = isLoggedIn;