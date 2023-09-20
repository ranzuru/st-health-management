const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const userSchema = require('../model/userSchema.js');

// @desc GET all users
// @route Retrieve/ GET All Users
// @access Private
const getAllUsers = asyncHandler (async (req, res) => {
    const allUser = await userSchema.find().select('-password').lean();
    if (!allUser?.length) {
        return res.status(400).json({ message: 'no users found' });
    };
    res.json(allUser);
});

// @desc GET single users
// @route Retrieve/ GET Single User
// @access Private
const getUser = async (req, res) => {
    try {
        let specificUser = await userSchema.findById(req.params.id);
        if (specificUser) {
            specificUser.password = undefined;
            res.send(specificUser);
        }
        else {
            res.send({ message: "No user found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc POST single users
// @route Create/ POST Single User 
// @access Private
const postUser = asyncHandler (async (req, res) => {
    const{ user_firstName, user_lastName, user_phoneNumber, user_email, user_password, user_role } = req.body;
    // confirm data
    if(!user_email || !user_password || !user_role.length) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    // check for duplicate
    const duplicateEmail = await userSchema.findOne({ user_email }).lean().exec();
    if(duplicateEmail) {
        return res.status(400).json({ message: 'email already exists' });
    };
    // hash password
    // 10 salt rounds
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const userObject = {user_firstName, user_lastName, user_phoneNumber, user_email, "user_password": hashedPassword, user_role};
    // create and store new user
    const newUser = await userSchema.create(userObject);
    // user created
    if (newUser) {
        res.status(201).json({ message: `user ${user_email} created` });
    } else {
        res.status(400).json({ message: 'failed to create user' });
    };
});

// @desc Update Single User
// @route Update/ PATCH Single User
// @access Private
const updateUser = asyncHandler (async (req, res) => {
    const { _id, user_firstName, user_lastName, user_phoneNumber, user_email, user_password, user_role } = req.body;
    // confirm data
    if (!_id || !user_email) {
        res.status(400).json({ message: 'all fields are required' });
    };
    // check if email of the current user exists
    const createdUser = await userSchema.findById(_id).exec();
    if (!createdUser) {
        res.status(400).json({ message: 'user not found' });
    };
    // check for duplicate
    const duplicate = await userSchema.findOne({ _id }).lean().exec();
    // allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'duplicate email' });
    };
    createdUser.user_firstName = user_firstName;
    createdUser.user_lastName = user_lastName;
    createdUser.user_phoneNumber = user_phoneNumber;
    createdUser.user_email = user_email;
    if (user_password) {
        // hash password
        // 10 salt rounds
        createdUser.user_password = await bcrypt.hash(user_password, 10);
    };
    createdUser.user_role = user_role;
    const updatedUser = await createdUser.save();
    res.json({ message: `user ${updatedUser.user_email} updated` });
});

// @desc Delete Single User
// @route Delete Single User
// @access Private
const deleteUser = asyncHandler (async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ message: 'user id required' });
    };
    const deleteUser = await userSchema.findById(_id).exec();
    if (!deleteUser) {
        return res.status(400).json({ message: 'user not found' });
    };
    const result = await deleteUser.deleteOne();
    const reply = `email ${result.user_email} with ID ${result._id} deleted`;
    res.json(reply);
});

module.exports = { 
    getAllUsers, 
    getUser, 
    postUser,   
    updateUser,
    deleteUser 
};