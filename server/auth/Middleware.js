const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); 
const authenticateMiddleware = require('./auth/authenticateMiddleware.js');
const router = express.Router();

// Signup route
router.post('/register', async (req, res) => {
    try {
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
            role
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Login route
router.post('/login', async (req, res) => {
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
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/logout', (req, res) => {
    try {
    // Destroy the session (if using sessions)
    req.session.destroy();
  
    // Clear any authentication tokens or cookies
    // Example with cookies
    localStorage.removeItem('authToken');
  
    // Send a response indicating successful logout
    res.json({ message: 'Logged out successfully' });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
  });

// Protected route
router.get('/protected', authenticateMiddleware, (req, res) => {
    // The middleware verifies the token and attaches user data to req.userData
    res.status(200).json({ message: 'Access granted to protected route', user: req.userData });
});

module.exports = router;