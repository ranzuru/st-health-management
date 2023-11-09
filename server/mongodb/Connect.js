const mongoose = require('mongoose');

const connectDB = (url) => {
    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('MongoDB Connection Status: Active'))
        .catch((error) => console.log(error));
}

module.exports = connectDB;