const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async (req, res) => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected ${connect.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;
