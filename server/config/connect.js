// connect.js
require('dotenv').config();
//Import required modules and packages
const mongoose = require('mongoose');
// Extract the enviromental variables
const uri = process.env.DATABASE_URL
const database = process.env.DATABASE_NAME

//==========CHECK IF ALL ENVIROMENTAL VARIABLES ARE PRESENT=============
// Conditional rendering to check if the environmental variables are missing
if (!uri || !database) {
    console.error('[ERROR: connect.js] Missing enviromental variables: DATABASE_URL or DATABASE_NAME');
    process.exit(1);// Exit the process with a failure code
}

//==================MONGODB CONNECTION SETUP==================//
mongoose.Promise = global.Promise// Use native JavaScript promises for Mongoose

//Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: database,// Explicit database selection
            serverSelectionTimeoutMS: 5000,// How long to try finding a server
            connectTimeoutMS: 10000, // How long to wait before failing connection
        })
        console.log('[SUCCESS: connect.js]: Successfully connected to MongoDB');//Log a message in the console for debugging purposes
        
    } catch (error) {
        console.error('[ERROR: connect.js] Error connecting to MongoDB', error);//Log an error message in the console for debugging purposes
        process.exit(1);  // Exit the process with a failure code
    }
}

// ================== MONGOOSE CONNECTION EVENT LISTENERS ==================

// Fired if an error occurs after initial connection
mongoose.connection.on('error', (error) => {
    console.error(`[ERROR: connect.js] Error connecting to MongoDb database. Exiting now...`, error);
})

// Fired when MongoDB disconnects (network issue, restart, etc.)
mongoose.connection.on('disconnected', () => {
    console.warn('[WARNING: connectDB.js] MongoDB disconnected! Attempting reconnection...');
});

// Fired when MongoDB successfully reconnects
mongoose.connection.on("reconnected", () => {
    console.log("[INFO: connectDB.js] MongoDB Reconnected!");
});

// Fired once when the connection is fully opened
mongoose.connection.once('open', async () => {
    console.log("[SUCCESS: connectDB.JS] Database connection established");
});


// ================== EXPORT ==================
// Export the connection function so it can be used in app.js / server.js
module.exports = connectDB;