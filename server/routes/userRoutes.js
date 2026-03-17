// userRoutes.js
/* Load environment variables from a .env 
file using the dotenv package*/
require('dotenv').config();
//Import required modules and packages
const express = require('express');// Import Express to handle routing
const jwt = require('jsonwebtoken');// Import the jsonwebtoken module for handling JSON Web Tokens
const bcrypt = require('bcrypt');// Import bcrypt for password hashing and comparison
const mongoose = require('mongoose');// Import mongoose for ObjectId validation
//Create an instance of the Express Router
const router = express.Router()
// Import the User model and middleware functions
const User = require('../models/userSchema');//Import User model
const Quiz = require('../models/quizSchema');// Import Quiz model
const Score = require('../models/scoreSchema');// Import Score model
const { checkJwtToken, hashPassword, checkPasswordStrength, checkAdmin } = require('./middleware');// Import middleware: JWT auth, password hashing, strength check, admin guard
// Extract environmental variables
const secretKey = process.env.JWT_SECRET_KEY;

//--------------CHECK ENVIROMENTAL VARIABLES----------------
//Conditional rendering to check if enviromental variables are present
if (!secretKey) {
    console.error('[ERROR: userRoutes.js] JWT_SECRET_KEY is not defined in environment variables');
    process.exit(1); // Exit the application with an error code
}

//=================ROUTES==========================
//---------------------GET-------------------
// Route to Get current user details
router.get('/me', checkJwtToken, async (req, res) => {
    try {
        const userId = req.user?.userId;// Extract the userId from the decoded JWT token payload

        //Conditional rendering to check if user ID exists
        if (!userId) {
            console.error(`[ERROR: userRoutes.js]: Unauthorized: No userId found in the token payload`);
            return res.status(401).json({ message: `Unauthorized` })// Send a 401 (Unauthorized) status code with a message
        }

        const user = await User.findById(userId)// Find the user in the database by their ID
        .select('-password')// Exclude the password field from the returned document
        .exec()// Execute the query

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
router.get('/findUsers', checkJwtToken, async (req, res) => {
    try {        
        const { username } = req.query;// Extract the username from the query parameters
        // If a username is provided, use it to filter users, otherwise return all users
        const query = username ? { username } : {};// Build the query object based on whether a username was provided
        const users = await User.find(query).select('-password'); // Fetch matching users, excluding the password field
    
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
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body || {};//Extract the usersername and password

        // Conditional rendering to check that both email and password are present
        if (!username || !password) {
            console.error('[ERROR: userRoutes.js , /login] Username and password are required');// Log an error message in the console for debugging purposes
            return res.status(400).json({ message: 'Username and password are required' });// Send a 400 (Bad Request) status code with a message
        }

         //Find the user by username 
        const user = await User.findOne({ 'username': username })
            .select('+password')//include the password field
            .exec();//Execute the query

        // Conditional rendering to check if user exists
        if (!user) {
            console.error('[ERROR: userRoutes.js] User not found');// Log an error message in the console for debugging purposes
            return res.status(404).json({ message: 'User not found' });// Send a 404 (Not Found) status code with a message
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);// Compare the provided password against the stored hashed password
        // Conditional rendering to check if password is valid
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
            token: jwtToken,// The signed JWT for subsequent authenticated requests
            userId: user._id,// The user's unique database ID
            fullName: user.fullName,// The user's full name object
            isAdmin: !!user.admin,// Boolean flag indicating admin status
        });


    } catch (error) {
          console.error('[ERROR: userRoutes.js] Login Failed:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal Server Error' });// Send a 500 Internal Server Error status code with a message
    }
})

// Route for user registration
router.post('/register', checkPasswordStrength, hashPassword, async (req, res) => {
    try {
        const { username, fullName, email, dateOfBirth, admin, password } = req.body;// Extract user details from the request body

        //Conditional rendering to check that all the required fields exist
        if (!username || !fullName?.firstName || !fullName?.lastName || !email || !dateOfBirth || !password) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        //------------CHECK FOR DUPLICATES===============
        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        // Conditional rendering to check if a user with the same username already exists
        if (existingUsername) {
            return res.status(409).json({ message: 'Username is already taken' });
        }
        // Check for duplicate email
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        // Conditional rendering to check if a user with the same email already exists
        if (existingEmail) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Validate admin age (must be 18+)
        if (admin) {
            const dob = new Date(dateOfBirth);// Parse the date of birth string into a Date object
            const today = new Date();// Get today's date
            let age = today.getFullYear() - dob.getFullYear();// Calculate the initial age based on birth year
            const monthDiff = today.getMonth() - dob.getMonth();// Check if the birthday has passed this year
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;// Adjust age if the birthday hasn't occurred yet this year
            }
            if (age < 18) {
                return res.status(400).json({ message: 'Admin users must be 18 years or older' });// Send a 400 (Bad Request) status code with a message
            }
        }

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
            password,
        });

        await newUser.save();// Save the new user document to the database

        console.log('[INFO: userRoutes.js] New user registered:', {
            userId: newUser._id,
            username: newUser.username,
        });

        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        // Surface Mongoose validation errors clearly
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);// Extract all validation error messages
            return res.status(400).json({ message: messages[0] });// Return the first validation error message
        }
        console.error('[ERROR: userRoutes.js] Registration failed:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//---------------------PATCH-------------------
//Route to edit a user by ID
//Send a patch request to the /editUser/:id endpoint
router.patch('/editUser/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Extract the user ID from the URL parameters
        const { username, fullName, email } = req.body;// Extract editable fields from the request body

        // Find the user by ID
        const user = await User.findById(id);// Query the database for the user document
        // Conditional rendering to check if user exists
        if (!user) {
            console.error('[ERROR: userRoutes.js, editUser/:id]User not found' );
            return res.status(404).json({ message: 'User not found' });// Send a 404 (Not Found) status code with a message
        }

        // Build updates from provided fields — only include non-empty string values
        const updates = {};// Object to hold only the fields that need to be updated
        if (typeof username === 'string' && username.trim() !== '') {
            updates.username = username.trim();// Trim whitespace from the username
        }
        if (typeof fullName?.firstName === 'string' && fullName.firstName.trim() !== '') {
            updates['fullName.firstName'] = fullName.firstName.trim();// Trim whitespace from the first name
        }
        if (typeof fullName?.lastName === 'string' && fullName.lastName.trim() !== '') {
            updates['fullName.lastName'] = fullName.lastName.trim();// Trim whitespace from the last name
        }
        if (typeof email === 'string' && email.trim() !== '') {
            updates.email = email.trim().toLowerCase();// Normalise email to lowercase
        }

        // Reject request if no valid fields were provided
        if (Object.keys(updates).length === 0) {
            console.error('[ERROR: userRoutes.js, editUser/:id] No valid fields provided for update');
            return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
        }

        // Check for duplicate username or email (excluding current user)
        const orConditions = [];// Array to hold the duplicate-check conditions
        if (updates.username) orConditions.push({ username: updates.username });// Add username condition if it is being updated
        if (updates.email) orConditions.push({ email: updates.email });// Add email condition if it is being updated

        if (orConditions.length > 0) {
            const dup = await User.findOne({ _id: { $ne: id }, $or: orConditions }).exec();// Search for another user with the same username or email
            if (dup) {
                const field = dup.username === updates.username ? 'Username' : 'Email';// Determine which field caused the conflict
                console.error(`[ERROR: userRoutes.js, /editUser/:id] ${field} already in use`);
                return res.status(409).json({ message: `${field} is already in use` });// Send a 409 (Conflict) status code with a message
            }
        }

        // Apply updates and save
        const oldUsername = user.username;// Capture old username before updating
        if (updates.username) user.username = updates.username;// Apply the new username if provided
        if (updates.email) user.email = updates.email;// Apply the new email if provided
        if (updates['fullName.firstName'] || updates['fullName.lastName']) {
            user.fullName = {
                firstName: updates['fullName.firstName'] ?? user.fullName.firstName,// Use new first name or keep existing
                lastName: updates['fullName.lastName'] ?? user.fullName.lastName,// Use new last name or keep existing
            };
        }
        await user.save();// Persist the updated user document to the database

        // If username was changed, propagate it to the Quiz and Score collections
        if (updates.username && updates.username !== oldUsername) {
            await Quiz.updateMany(
                { username: oldUsername },
                { $set: { username: updates.username } }// Replace old username with new username in all Quiz documents
            );
            await Score.updateMany(
                { username: oldUsername },
                { $set: { username: updates.username } }// Replace old username with new username in all Score documents
            );
            console.log(`[INFO: userRoutes.js] Username propagated from '${oldUsername}' to '${updates.username}' in Quiz and Score collections`);
        }

        console.log('[INFO: userRoutes.js] User updated:', {
            userId: user._id,
            username: user.username,
        });

        return res.status(200).json({ success: true, message: 'User updated successfully', updatedUser: user });// Send a 200 OK status code with the updated user data

    } catch (error) {
        console.error('[ERROR: userRoutes.js] Edit User failed:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json({ success: false, message: 'Internal Server Error' });// Send a 500 (Internal Server Error) status code with a message
    }
});

//Route to edit a user password
//Send a patch request to the /editPassword endpoint
router.patch('/editPassword', checkJwtToken, checkPasswordStrength, hashPassword, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};//Extract currentPassword and new password from the request body

        // Conditional rendering to check if both currentPassword and newPassword are present
        if (!currentPassword || !newPassword) {
            console.error('[ERROR: userRoutes.js, /editPassword] currentPassword and newPassword are required');//Log an error message in the console for debugging purposes
            return res.status(400).json(//Return a 400 (Bad Request) status code with a error message
                {success: false, message: 'currentPassword and newPassword are required'}
            );
        }

        const userId = req.user?.userId;//Extract userId from the decoded token payload
        // Conditional rendering to connect current password
        if (!userId) {
            console.error('[ERROR: userRoutes.js, /editPassword] Unauthorized: No userId found in token');//Log an error message in the console for debugging purposes
            return res.status(401).json({ success: false, message: 'Unauthorized' });//Send a 401 (Unauthorized) status code with a message
        }

        // Require password field for comparison
        const user = await User.findById(userId) // Find the user by userId
            .select('+password')// Include the password field for comparison
            .exec();// Execute the query

        // Conditional rendering to check if user exists
        if (!user) {
            console.error('[ERROR: userRoutes.js, /editPassword] User not found');//Log an error message in the console for debugging purposes
            return res.status(404).json({ success: false, message: 'User not found' });//Send a 404 (Not Found) status code with a message
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);// Compare the provided current password against the stored hash
        // Conditional rendering to check if current password is valid
        if (!isCurrentPasswordValid) {
            console.error('[ERROR: userRoutes.js, /editPassword] Current password is incorrect');//Log an error message in the console for debugging purposes
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });//Send a 401 (Unauthorized) status code with a message
        }
        // Conditional rendering to prevent new password from being the same as current password
        if (currentPassword === newPassword) {
            console.error('[ERROR: userRoutes.js, /editPassword] New password must be different from old password');//Log an error message in the console for debugging purposes
            return res.status(400).json({ success: false, message: 'New password must be different from old password' });//Send a 400 Bad Request status code with a message
        }
        user.password = newPassword;// Assign the new (already hashed by middleware) password
        await user.save();// Save the updated user
        // Return a success response
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('[ERROR userRoutes.js] /editPassword:', error.message);;//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, message: 'Internal Server Error' });//Send a 500 (Internal Server Error) status code with a message
    }
})

//----------------------DELETE-------------------
//Route to delete a user by ID
//Send a delete request to the /deleteUser/:id endpoint
router.delete('/deleteUser/:id', checkJwtToken, checkAdmin, async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId; // 1) Extract userId from the decoded token payload

          // 2) Ensure the user is logged in
        if (!loggedInUserId) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Unauthorized: No userId found in token');
            return res.status(401).json({ message: 'Unauthorized' });// Send a 401 (Unauthorized) status code with a message
        }
        const { id } = req.params; // 3) Extract id from the request parameters
        // Validate ObjectId format before attempting to delete
        if (!mongoose.isValidObjectId(id)) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Invalid ObjectId:', id);
            return res.status(400).json({ message: 'Invalid user id.' });// Send a 400 (Bad Request) status code with a message
        }
        // 4) Prevent users from deleting their own account
        if (loggedInUserId === id) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Users cannot delete their own account');
            return res.status(400).json({ message: 'Users cannot delete their own account' });// Send a 400 (Bad Request) status code with a message
        }

        // 5) Atomic delete: only non-admin users can be deleted
        const removedUser = await User.findOneAndDelete({
            _id: id,// Match the user by their ID
            admin: { $ne: true },   // Cannot delete admin users
        }).select('_id username admin');// Return only the fields needed for cascade deletion

        // Conditional rendering to check if the user was found and deleted
        if (!removedUser) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] User not found (or cannot be deleted).');
            return res.status(404).json({ success: false, message: 'User not found (or cannot be deleted).' });// Send a 404 (Not Found) status code with a message
        }

        // Delete all scores and quizzes associated with this user
        await Score.deleteMany({ username: removedUser.username });// Remove all score records belonging to the deleted user
        await Quiz.deleteMany({ username: removedUser.username });// Remove all quiz records belonging to the deleted user

        console.log(`[INFO: userRoutes.js, /deleteUser/:id] User with ID ${id} deleted successfully`);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });// Send a 200 OK status code with a success message
    } catch (error) {
        console.error('[ERROR: userRoutes.js, /deleteUser/:id] Error deleting user:', error.message);// Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, message: 'Internal Server Error' });// Send a 500 (Internal Server Error) status code with a message
    }
})


//Export the userRouter
module.exports = router