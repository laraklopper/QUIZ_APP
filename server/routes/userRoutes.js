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
        .select('')
    } catch (error) {
        
    }
})
module.exports = router