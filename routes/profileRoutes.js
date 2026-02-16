const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, updateProfile);
router.get('/:role', protect, getProfile);

module.exports = router;
