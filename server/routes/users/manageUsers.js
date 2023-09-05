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
    'approved',
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

// Route to update the 'approved' status of a user
router.put('/approveUser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and update the 'approved' field
    const updatedUser = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });

    if (!updatedUser) {
      // User with the provided ID was not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated user as a JSON response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

// Route to delete a user by ID
router.delete('/deleteUser/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // User with the provided ID was not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success message as a JSON response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});


// Add more routes for fetching specific user data, updates, or other actions

module.exports = router;