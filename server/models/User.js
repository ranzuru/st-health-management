const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_firstName: {
        type: String,
        required: true,
    },
    user_lastName: {
        type: String,
        required: true,
    },
    user_phoneNumber: {
        type: Number,
        required: true,
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_role: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
