const express = require('express');
const campgroundController = require('../controllers/campgroundController');
const isLoggedIn = require('../middleware/auth');
const { isRole } = require('../middleware/role');
const { isOwner } = require('../middleware/owner');

const router = express.Router();

router.get('/', isLoggedIn, campgroundController.index);
router.get('/new', isLoggedIn, isRole('admin', 'owner'), campgroundController.newForm);
router.post('/', isLoggedIn, isRole('admin', 'owner'), campgroundController.create);
router.get('/:id', isLoggedIn, campgroundController.show);
router.get('/:id/edit', isLoggedIn, isOwner, campgroundController.editForm);
router.put('/:id', isLoggedIn, isOwner, campgroundController.update);
router.delete('/:id', isLoggedIn, isOwner, campgroundController.delete);

module.exports = router;