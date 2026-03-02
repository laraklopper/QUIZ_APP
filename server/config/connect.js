require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.DATABASE_URL
const database = process.env.DATABASE_NAME

//==========CHECK IF ALL ENVIROMENTAL VARIABLES ARE PRESENT=============
// Conditional rendering to check if the environmental variables are missing
if (!uri || !database) {
    console.error('[ERROR: connect.js] Missing enviromental variables: DATABASE_URL or DATABASE_NAME');
    process.exit(1);// Exit the process with a failure code
}

// =====================================================
mongoose.Promise = global.Promise;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: database,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        })
        console.log('[SUCCESS: connect.js]: Successfully connected to MongoDB');
        
    } catch (error) {
        console.error('[ERROR: connect.js] Error connecting to MongoDB', error);
        process.exit(1);  
    }
}

// ================== MONGOOSE CONNECTION EVENT LISTENERS ==================

// Fired if an error occurs after initial connection
mongoose.connection.on('error', (error) => {
    console.error(`[ERROR: connect.js] Error connecting to MongoDb database. Exiting now...`, error);
    process.exit(1);// Exit to prevent app running without DB
})

// Fired when MongoDB disconnects (network issue, restart, etc.)
mongoose.connection.on('disconnected', () => {
    console.warn(
        '[WARNING: connectDB.js] MongoDB disconnected! Attempting reconnection...'
    );
    // Attempt to reconnect automatically
    connectDB();
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