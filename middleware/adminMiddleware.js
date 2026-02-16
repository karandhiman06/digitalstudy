const admin = (req, res, next) => {
    if (req.user && req.user.roles.some(r => r.role === 'Administrative' && r.status === 'Approved')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };
