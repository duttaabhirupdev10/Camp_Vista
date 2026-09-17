const campgroundModel = require('../models/campgroundModel');

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    
    // User must be logged in
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    // Admins have access to everything
    if (req.session.user.role === 'admin') {
        return next();
    }

    const { data: campground, error } = await campgroundModel.findOwnerById(id);
        
    if (error || !campground) {
        return res.status(404).send('Campground Not Found');
    }

    if (campground.owner !== req.session.user.id) {
        return res.status(403).send('Access Denied: You are not the owner of this room.');
    }

    next();
};