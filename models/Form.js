const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['text', 'multiple-choice'], default: 'text' },
    options: [{ type: String }] // For multiple choice
});

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [questionSchema],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of Student IDs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', formSchema);
