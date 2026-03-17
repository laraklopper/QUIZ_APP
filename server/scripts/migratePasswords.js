// migratePasswords.js
// One-time script to hash any plaintext passwords in the database.
// Safe to re-run — already-hashed passwords are skipped.
// Run from the server/ directory: node scripts/migratePasswords.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

const SALT_ROUNDS = 10;

const uri = process.env.DATABASE_URL;
const database = process.env.DATABASE_NAME;

if (!uri || !database) {
    console.error('[ERROR: migratePasswords.js] Missing DATABASE_URL or DATABASE_NAME in environment variables');
    process.exit(1);
}

async function migrate() {
    await mongoose.connect(uri, { dbName: database });
    console.log('[INFO: migratePasswords.js] Connected to DB');

    const users = await User.find({}).select('+password');
    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
        // Bcrypt hashes start with $2b$ or $2a$ — skip if already hashed
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            skipped++;
            continue;
        }
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        await user.save();
        console.log(`[INFO: migratePasswords.js] Migrated: ${user.username}`);
        migrated++;
    }

    console.log(`[DONE: migratePasswords.js] ${migrated} migrated, ${skipped} already hashed (skipped), ${users.length} total.`);
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('[ERROR: migratePasswords.js]', err.message);
    process.exit(1);
});
