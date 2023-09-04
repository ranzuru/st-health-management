const express = require('express');
const router = express.Router();
const User = require('../../models/User.js'); // Import your User model

// Define the fields you want to select, including firstName and lastName
const selectedFields = [
    '_id',
    'firstName',
    'lastName',
    'phoneNumber',
    'email',
    'gender',
    'role',
    'createdAt',
    'status',
  ];

// Route to fetch user data from MongoDB
router.get('/userFetch', async (req, res) => {
  try {
   // Fetch users from MongoDB with selected fields
   const users = await User.find({}, selectedFields);

   // Map the users to include a full name field
   const usersWithFullName = users.map((user) => ({
     ...user.toObject(),
     name: `${user.firstName} ${user.lastName}`,
   }));

   // Send the modified user data as a JSON response
   res.status(200).json(usersWithFullName);
 } catch (error) {
   console.error('Error fetching user data:', error);
   res.status(500).json({ error: 'An error occurred', details: error.message });
 }
});

// Add more routes for fetching specific user data, updates, or other actions

module.exports = router;
