const express = require('express');
const campgroundController = require('../controllers/campgroundController');
const isLoggedIn = require('../middleware/auth');
const { isRole } = require('../middleware/role');
const { isOwner } = require('../middleware/owner');

const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', isLoggedIn, campgroundController.index);
router.get('/new', isLoggedIn, isRole('admin', 'owner'), campgroundController.newForm);
router.post('/', isLoggedIn, isRole('admin', 'owner'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'qr_code', maxCount: 1 }]), campgroundController.create);
router.get('/:id', isLoggedIn, campgroundController.show);
router.get('/:id/edit', isLoggedIn, isOwner, campgroundController.editForm);
router.put('/:id', isLoggedIn, isOwner, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'qr_code', maxCount: 1 }]), campgroundController.update);
router.delete('/:id', isLoggedIn, isOwner, campgroundController.delete);

module.exports = router;