const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Teacher', 'Administrative'],
        required: true
    },
    profileData: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
