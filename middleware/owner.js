const campgroundModel = require('../models/campgroundModel');

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    
    // User must be logged in
    if (!res.locals.currentUser) {
        return res.redirect('/');
    }

    // Admins have access to everything
    if (res.locals.currentUser.role === 'admin') {
        return next();
    }

    const { data: campground, error } = await campgroundModel.findOwnerById(id);
        
    if (error || !campground) {
        return res.status(404).send('Campground Not Found');
    }

    if (campground.owner !== res.locals.currentUser.id) {
        return res.status(403).send('Access Denied: You are not the owner of this room.');
    }

    next();
};