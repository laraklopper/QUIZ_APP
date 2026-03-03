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

//Route to GET all users
router.get('/findUsers',  async (req, res) => {
    try {        
        const { username } = req.query;// Extract the username from the query parameters
        // If a username is provided, use it to filter users, otherwise return all users
        const query = username ? { username } : {};
        const users = await User.find(query).select('-password'); // Fetch users based on the query object
    
        // console.log(users);// Log the fetched users for debugging purposes
        res.status(200).json(users);// Send the list of users as the response
    } 
    catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purpose
        res.status(500).json(// Send 500(Internal server error) status code and error message in JSON response
            { message: 'Internal server Error' }
        );
    }
})
module.exports = router