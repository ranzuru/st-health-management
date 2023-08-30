// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.signup = async (req, res) => {
    try {
        // Extract user data from the request body
        const { firstName, lastName, phoneNumber, email, password, gender, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new User({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword,
            gender,
            role,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists and password is valid
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred is', details: error.message });
    }
};
