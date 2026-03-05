// userRoutes.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router()
const secretKey = process.env.JWT_SECRET_KEY;

const User = require('../models/userSchema');
const { checkJwtToken, checkAge, checkPasswordStrength, registrationLimiter, loginLimiter, hashPassword } = require('./middleware');

router.get('/me', checkJwtToken, async (req, res) => {
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
router.get('/findUsers', checkJwtToken,  async (req, res) => {
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

//-----------POST-------------------
// Route for user login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body || {};//Extract the usersername and password

        // Conditional rendering to check that both email and password are present
        if (!username || !password) {
            console.error('[ERROR: userRoutes.js , /login] Email and password are required');// Log an error message in the console for debugging purposes
            return res.status(400).json({ message: 'Email and password are required' });// Send a 400 (Bad Request) status code with a message
        }

         //Find the user by username and include the password field
        const user = await User.findOne({ 'username': username })
            .select('+password')
            .exec();

        // Conditional rendering to check if user exists
        if (!user) {
            console.error('[ERROR: userRoutes.js] User not found');// Log an error message in the console for debugging purposes
            return res.status(404).json({ message: 'User not found' });// Send a 404 (Not Found) status code with a message
        }

        const  isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            console.error('[ERROR: userRoutes.js] Incorrect password');
            return res.status(401).json({ message: 'Invalid credentials' });// Send a 401 (Unauthorized) status code with a message
        }

                // Generate JWT Token
        const jwtToken = jwt.sign(
            {
                userId: user._id,// Set the userId in the token payload
                isAdmin: !!user.admin,// Set the isAdmin flag in the token payload
            },
            secretKey,// Use the secret key to sign the token
            {
                expiresIn: '12h', // Set the token expiration time
                algorithm: 'HS256' // Set the JWT algorithm
            }
        );

        // Log an info message in the console for debugging purposes
        console.log('[INFO: userRoutes.js] User logged in:', {
            userId: user._id,
            username: user.username,
        });
        // Send a 200 OK status code with the JWT token and user details
        return res.status(200).json({
            token: jwtToken,
            userId: user._id,
            fullName: user.fullName,
            isAdmin: !!user.admin,
        });


    } catch (error) {
          console.error('[ERROR: userRoutes.js] Login Failed:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal Server Error' });// Send a 500 Internal Server Error status code with a message
    }
})

// Route for user registration
router.post('/register', checkAge, checkPasswordStrength, registrationLimiter, hashPassword, async (req, res) => {
    try {
        const { username, fullName, email, dateOfBirth, admin, password } = req.body;

        // Validate required fields
        if (!username || !fullName?.firstName || !fullName?.lastName || !email || !dateOfBirth || !password) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        // Check for duplicate email
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Validate admin age (must be 18+)
        if (admin) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                return res.status(400).json({ message: 'Admin users must be 18 years or older' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName,
            },
            email,
            dateOfBirth,
            admin: admin || false,
            password: hashedPassword,
        });

        await newUser.save();

        console.log('[INFO: userRoutes.js] New user registered:', {
            userId: newUser._id,
            username: newUser.username,
        });

        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        // Surface Mongoose validation errors clearly
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        console.error('[ERROR: userRoutes.js] Registration failed:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//---------------------PUT-------------------

//----------------------DELETE-------------------

//Export the userRouter
module.exports = router