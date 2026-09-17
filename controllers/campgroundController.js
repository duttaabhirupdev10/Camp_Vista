const campgroundService = require('../services/campgroundService');

const campgroundController = {
    async index(req, res) {
        try {
            const campgrounds = await campgroundService.listCampgrounds();
            res.render('campgrounds/index', { campgrounds });
        } catch (error) {
            console.error(error);
            res.send('Error fetching campgrounds');
        }
    },

    newForm(req, res) {
        res.render('campgrounds/new');
    },

    async create(req, res) {
        try {
            const campground = await campgroundService.createCampground(req.body.campground, req.session.user.id);
            res.redirect(`/campgrounds/${campground.id}`);
        } catch (error) {
            console.error(error);
            res.send('Error creating campground');
        }
    },

    async show(req, res) {
        const { data: campground, error } = await campgroundService.getCampground(req.params.id);
        if (error || !campground) return res.send('Campground not found');

        campground._id = campground.id;
        res.render('campgrounds/show', { campground });
    },

    async editForm(req, res) {
        const { data: campground, error } = await campgroundService.getCampground(req.params.id);
        if (error || !campground) return res.send('Campground not found');

        campground._id = campground.id;
        res.render('campgrounds/edit', { campground });
    },

    async update(req, res) {
        try {
            const campground = await campgroundService.updateCampground(req.params.id, req.body.campground);
            res.redirect(`/campgrounds/${campground.id}`);
        } catch (error) {
            res.send('Error updating campground');
        }
    },

    async delete(req, res) {
        try {
            await campgroundService.deleteCampground(req.params.id);
            res.redirect('/campgrounds');
        } catch (error) {
            res.send('Error deleting campground');
        }
    }
};

module.exports = campgroundController;