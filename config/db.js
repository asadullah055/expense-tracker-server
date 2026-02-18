// connect db
const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
    if (isConnected) return mongoose.connection;
    if (connectionPromise) return connectionPromise;
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set");
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    })
    .then((conn) => {
        isConnected = true;
        console.log('MongoDB connected');
        return conn;
    })
    .catch((err) => {
        connectionPromise = null;
        console.error(err.message);
        throw err;
    });

    return connectionPromise;
};

module.exports = connectDB;
