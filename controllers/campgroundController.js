const campgroundService = require('../services/campgroundService');

function parseCampgroundFields(payload) {
    if (!payload) return;
    if (payload.price !== undefined && payload.price !== '') {
        payload.price = parseFloat(payload.price);
    }
    if (payload.total_rooms !== undefined && payload.total_rooms !== '') {
        const parsedRooms = parseInt(payload.total_rooms, 10);
        payload.total_rooms = Number.isNaN(parsedRooms) ? 5 : Math.max(0, parsedRooms);
    }
}

const campgroundController = {
    async index(req, res) {
        try {
            const filters = {
                search: req.query.search || '',
                maxPrice: req.query.maxPrice || '',
                check_in: req.query.check_in || '',
                check_out: req.query.check_out || ''
            };
            const campgrounds = await campgroundService.listCampgrounds(filters);
            res.render('campgrounds/index', { campgrounds, filters });
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
            const { uploadToNeon } = require('../utils/neonStorage');
            
            // Check if an image was uploaded
            if (req.files && req.files['image']) {
                const imageFile = req.files['image'][0];
                const imageUrl = await uploadToNeon(imageFile.buffer, imageFile.originalname, imageFile.mimetype);
                req.body.campground.image = imageUrl;
            }

            // Check if a qr_code was uploaded
            if (req.files && req.files['qr_code']) {
                const qrFile = req.files['qr_code'][0];
                const qrUrl = await uploadToNeon(qrFile.buffer, qrFile.originalname, qrFile.mimetype);
                req.body.campground.qr_code = qrUrl;
            }

            const ownerId = res.locals.currentUser ? res.locals.currentUser.id : req.auth.userId;
            
            parseCampgroundFields(req.body.campground);

            const campground = await campgroundService.createCampground(req.body.campground, ownerId);
            res.redirect(`/campgrounds/${campground.id}`);
        } catch (error) {
            console.error(error);
            res.send('Error creating campground');
        }
    },

    async show(req, res) {
        const selectedDates = {
            check_in: req.query.check_in || '',
            check_out: req.query.check_out || ''
        };
        const { data: campground, error } = await campgroundService.getCampground(req.params.id, selectedDates);
        if (error || !campground) return res.send('Campground not found');

        campground._id = campground.id;
        res.render('campgrounds/show', {
            campground,
            selectedDates,
            bookingError: req.query.error || null
        });
    },

    async checkAvailability(req, res) {
        try {
            const { data, error } = await campgroundService.getAvailability(
                req.params.id,
                req.query.check_in,
                req.query.check_out
            );
            if (error || !data) {
                return res.status(404).json({ error: 'Campground not found' });
            }
            return res.json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to check room availability' });
        }
    },

    async editForm(req, res) {
        const { data: campground, error } = await campgroundService.getCampground(req.params.id);
        if (error || !campground) return res.send('Campground not found');

        campground._id = campground.id;
        res.render('campgrounds/edit', { campground });
    },

    async update(req, res) {
        try {
            const { uploadToNeon } = require('../utils/neonStorage');
            
            // Check if a new image was uploaded
            if (req.files && req.files['image']) {
                const imageFile = req.files['image'][0];
                const imageUrl = await uploadToNeon(imageFile.buffer, imageFile.originalname, imageFile.mimetype);
                req.body.campground.image = imageUrl;
            }

            // Check if a new qr_code was uploaded
            if (req.files && req.files['qr_code']) {
                const qrFile = req.files['qr_code'][0];
                const qrUrl = await uploadToNeon(qrFile.buffer, qrFile.originalname, qrFile.mimetype);
                req.body.campground.qr_code = qrUrl;
            }

            parseCampgroundFields(req.body.campground);
            const campground = await campgroundService.updateCampground(req.params.id, req.body.campground);
            res.redirect(`/campgrounds/${campground.id}`);
        } catch (error) {
            console.error(error);
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