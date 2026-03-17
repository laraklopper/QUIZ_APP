// migratePasswords.js
/* One-time script to find users with plaintext passwords in the
database and replace them with bcrypt hashes.
Safe to re-run — already-hashed passwords are skipped.
Run from the server/ directory: node scripts/migratePasswords.js */

//Import required modules and packages
require('dotenv').config();
const mongoose = require('mongoose');// Import Mongoose for MongoDB connection
const bcrypt = require('bcrypt');// Import bcrypt for password hashing
const User = require('../models/userSchema');// Import User model

// Industry standard — balances security and performance
const SALT_ROUNDS = 10;// Number of hashing rounds

// Extract environmental variables
const uri = process.env.DATABASE_URL;
const database = process.env.DATABASE_NAME;

// Conditional check to ensure required environment variables are present
if (!uri || !database) {
    console.error('[ERROR: migratePasswords.js] Missing DATABASE_URL or DATABASE_NAME in environment variables');
    process.exit(1);// Exit the process with a failure code
}

async function migrate() {
    // Connect to MongoDB using credentials from .env
    await mongoose.connect(uri, { dbName: database });
    console.log('[INFO: migratePasswords.js] Connected to DB');

    // Fetch all users, explicitly including the password field (select: false in schema)
    const users = await User.find({}).select('+password');
    let migrated = 0;// Counter for migrated users
    let skipped = 0;// Counter for already-hashed users

    for (const user of users) {
        // Bcrypt hashes always start with $2b$ or $2a$ — skip if already hashed
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            skipped++;
            continue;// Move to the next user
        }
        // Hash the plaintext password and overwrite it
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        await user.save();// Save the updated user to the database
        console.log(`[INFO: migratePasswords.js] Migrated: ${user.username}`);
        migrated++;
    }

    // Log a summary of the migration results
    console.log(`[DONE: migratePasswords.js] ${migrated} migrated, ${skipped} already hashed (skipped), ${users.length} total.`);
    await mongoose.disconnect();// Close the database connection
}

// Run the migration and handle any unexpected errors
migrate().catch(err => {
    console.error('[ERROR: migratePasswords.js]', err.message);
    process.exit(1);// Exit the process with a failure code
});
