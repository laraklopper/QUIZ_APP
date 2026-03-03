// userRoutes.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router()

const User = require('../models/userSchema');

router.get('/me', async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            console.error(`[ERROR: userRoutes.js]: Unauthorized: No userId found in the token payload`);
            return res.status(401).json({ message: `Unauthorized` })// Send a 401 (Unauthorized) status code with a message
        }

        const user = await User.findById(userId)
        .select('-password')
        .exec()

             // Conditional rendering to check if user exists
        if (!user) {
            console.error('[ERROR: userRoutes.js]: User not found');// Log an error message in the console for debugging purposes
            return res.status(404).json({ message: 'User not found' });// Send a 404 Not Found status code with a message
        }

        console.log(`[RESPONSE: userRoutes]`, user);// Log a response message in the console for debugging purposes
        return res.status(200).json(user)// Send a 200 OK status code with the user data
    } catch (error) {
        console.error('[ERROR: userRoutes.js] Error fetching user', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal Server Error', error: error.message });// Return a 500 (Internal Server Error) status code with a message
    }
})


module.exports = router