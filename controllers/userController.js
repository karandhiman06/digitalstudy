const User = require('../models/User');

// @desc    Add a role to current user
// @route   POST /api/users/role
// @access  Private
const addRole = async (req, res) => {
    const { role } = req.body;
    const validRoles = ['Student', 'Teacher', 'Administrative'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.user.id);

    if (user) {
        // Check if role already exists
        const roleExists = user.roles.find(r => r.role === role);
        if (roleExists) {
            return res.status(400).json({ message: 'Role already requested or assigned' });
        }

        user.roles.push({ role, status: 'Pending' });
        await user.save();

        res.status(200).json(user.roles);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin/Super Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Update user role status (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRoleStatus = async (req, res) => {
    const { role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
        const roleIndex = user.roles.findIndex(r => r.role === role);

        if (roleIndex !== -1) {
            user.roles[roleIndex].status = status;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'Role not found for this user' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user (Super Admin)
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user details (Super Admin - including roles)
// @route   PUT /api/users/:id/admin-update
// @access  Private/SuperAdmin
const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.roles) {
            user.roles = req.body.roles;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addRole,
    getUsers,
    updateUserRoleStatus,
    deleteUser,
    updateUserByAdmin
};
