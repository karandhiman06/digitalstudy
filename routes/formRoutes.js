const express = require('express');
const router = express.Router();
const {
    createForm,
    getMyForms,
    getAssignedForms,
    getFormById,
    submitForm,
    getSubmissions
} = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createForm);
router.get('/my-forms', protect, getMyForms);
router.get('/assigned', protect, getAssignedForms);
router.get('/:id', protect, getFormById);
router.post('/:id/submit', protect, submitForm);
router.get('/:id/submissions', protect, getSubmissions);

module.exports = router;
