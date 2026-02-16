const Form = require('../models/Form');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Create a new form (Teacher)
// @route   POST /api/forms
// @access  Private (Teacher)
const createForm = async (req, res) => {
    const { title, description, questions, assignedTo } = req.body;

    // Verify user is Teacher
    const isTeacher = req.user.roles.some(r => r.role === 'Teacher' && r.status === 'Approved');
    if (!isTeacher) {
        return res.status(403).json({ message: 'Only Teachers can create forms' });
    }

    try {
        const form = new Form({
            title,
            description,
            questions,
            assignedTo, // Array of student IDs
            createdBy: req.user.id
        });

        await form.save();
        res.status(201).json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get forms created by current user (Teacher)
// @route   GET /api/forms/my-forms
// @access  Private (Teacher)
const getMyForms = async (req, res) => {
    try {
        const forms = await Form.find({ createdBy: req.user.id });
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get forms assigned to current user (Student)
// @route   GET /api/forms/assigned
// @access  Private (Student)
const getAssignedForms = async (req, res) => {
    try {
        const forms = await Form.find({ assignedTo: req.user.id });

        // Enhance with submission status if needed later
        // For now just list them
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single form by ID
// @route   GET /api/forms/:id
// @access  Private
const getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit form answers (Student)
// @route   POST /api/forms/:id/submit
// @access  Private (Student)
const submitForm = async (req, res) => {
    const { answers } = req.body; // Array of { questionId, answer }
    const formId = req.params.id;

    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Check if assigned
        if (!form.assignedTo.includes(req.user.id)) {
            return res.status(403).json({ message: 'Form not assigned to you' });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({ form: formId, student: req.user.id });
        if (existingSubmission) {
            return res.status(400).json({ message: 'Already submitted this form' });
        }

        const submission = new Submission({
            form: formId,
            student: req.user.id,
            answers
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get submissions for a form (Teacher)
// @route   GET /api/forms/:id/submissions
// @access  Private (Teacher)
const getSubmissions = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });

        if (form.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const submissions = await Submission.find({ form: req.params.id })
            .populate('student', 'name email');

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createForm,
    getMyForms,
    getAssignedForms,
    getFormById,
    submitForm,
    getSubmissions
};
