const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedUsers = async () => {
    try {
        await User.deleteMany(); // Clear existing users

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@test.com',
                password: hashedPassword,
                roles: [
                    { role: 'User', status: 'Approved' },
                    { role: 'Administrative', status: 'Approved' }
                ]
            },
            {
                name: 'Student User',
                email: 'student@test.com',
                password: hashedPassword,
                roles: [
                    { role: 'User', status: 'Approved' },
                    { role: 'Student', status: 'Pending' }
                ]
            }
        ];

        await User.insertMany(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedUsers();
