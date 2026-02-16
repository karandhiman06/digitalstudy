const Profile = require('../models/Profile');

// @desc    Create or Update Profile for a specific role
// @route   POST /api/profiles
// @access  Private
const updateProfile = async (req, res) => {
    const { role, profileData } = req.body;

    const profileFields = {
        user: req.user.id,
        role,
        profileData
    };

    try {
        let profile = await Profile.findOne({ user: req.user.id, role });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id, role },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get current user profile by role
// @route   GET /api/profiles/:role
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
            role: req.params.role
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    updateProfile,
    getProfile
};
