const express = require('express');
const router = express.Router();
const {
    addRole,
    getUsers,
    updateUserRoleStatus,
    deleteUser,
    updateUserByAdmin
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Validates if user is Administrative (Super Admin implied by possession of this role and Approved status for MVP)
// ideally strict Super Admin might need a separate role or flag, but for this prompt 'Super Admin' 
// seems to map to the top-level 'Administrative' role which governs others.

router.post('/role', protect, addRole);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRoleStatus);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/admin-update', protect, admin, updateUserByAdmin);

module.exports = router;
