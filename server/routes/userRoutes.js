// userRoutes.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router()
const secretKey = process.env.JWT_SECRET_KEY;

const User = require('../models/userSchema');
const { checkJwtToken, checkAge, checkPasswordStrength, registrationLimiter, loginLimiter, hashPassword, checkAdmin, generalLimiter } = require('./middleware');

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
router.put('/editUser/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, fullName, email } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build updates from provided fields
        const updates = {};
        if (typeof username === 'string' && username.trim() !== '') {
            updates.username = username.trim();
        }
        if (typeof fullName?.firstName === 'string' && fullName.firstName.trim() !== '') {
            updates['fullName.firstName'] = fullName.firstName.trim();
        }
        if (typeof fullName?.lastName === 'string' && fullName.lastName.trim() !== '') {
            updates['fullName.lastName'] = fullName.lastName.trim();
        }
        if (typeof email === 'string' && email.trim() !== '') {
            updates.email = email.trim().toLowerCase();
        }

        if (Object.keys(updates).length === 0) {
            console.error('[ERROR: userRoutes.js, editUser/:id] No valid fields provided for update');
            return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
        }

        // Check for duplicate username or email (excluding current user)
        const orConditions = [];
        if (updates.username) orConditions.push({ username: updates.username });
        if (updates.email) orConditions.push({ email: updates.email });

        if (orConditions.length > 0) {
            const dup = await User.findOne({ _id: { $ne: id }, $or: orConditions }).exec();
            if (dup) {
                const field = dup.username === updates.username ? 'Username' : 'Email';
                console.error(`[ERROR: userRoutes.js, /editUser/:id] ${field} already in use`);
                return res.status(409).json({ message: `${field} is already in use` });
            }
        }

        // Apply updates and save
        if (updates.username) user.username = updates.username;
        if (updates.email) user.email = updates.email;
        if (updates['fullName.firstName'] || updates['fullName.lastName']) {
            user.fullName = {
                firstName: updates['fullName.firstName'] ?? user.fullName.firstName,
                lastName: updates['fullName.lastName'] ?? user.fullName.lastName,
            };
        }
        await user.save();

        console.log('[INFO: userRoutes.js] User updated:', {
            userId: user._id,
            username: user.username,
        });

        return res.status(200).json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        console.error('[ERROR: userRoutes.js] Edit User failed:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

//Route to edit a user password
//Send a put request to the /editPassword endpoint
router.put('/editPassword', checkJwtToken, checkPasswordStrength, hashPassword, passwordUpdateRateLimiter, async (req, res) => {
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
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
        // Conditional rendering to check if current password is valid
        if (!isCurrentPasswordValid) {
            console.error('[ERROR: userRoutes.js, /editPassword] Current password is incorrect');//Log an error message in the console for debugging purposes
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });//Send a 401 (Unauthorized) status code with a message
        }
        // Check if new password is same as current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        // Conditional rendering to prevent new password from being the same as current password
        if (isSamePassword) {
            console.error('[ERROR: userRoutes.js, /editPassword] New password must be different from old password');//Log an error message in the console for debugging purposes
            return res.status(400).json({ success: false, message: 'New password must be different from old password' });//Send a 400 Bad Request status code with a message
        }

        // Conditional rendering to prevent new password from being the same as current password
        if (currentPassword === newPassword) {
            console.error('[ERROR: userRoutes.js, /editPassword] New password must be different from old password');//Log an error message in the console for debugging purposes
            return res.status(400).json({ success: false, message: 'New password must be different from old password' });//Send a 400 Bad Request status code with a message
        }
        // Update password with hashed version (already hashed by hashPassword middleware)
        // Note: req.body.newPassword is now hashed by the hashPassword middleware
        user.password = req.body.newPassword; // This is the hashed version from middleware
        await user.save();// Save the updated user
        // Return a success response
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('[ERROR userRoutes.js] /editPassword:', error.message);;//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, message: 'Internal Server Error' });//Send a 500 (Internal Server Error) status code with a message
    }
})

//----------------------DELETE-------------------
router.delete('/deleteUser/:id', checkJwtToken, checkAdmin, generalLimiter, async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId; // 1) Extract userId from the decoded token payload

          // 2) Ensure the user is logged in
        if (!loggedInUserId) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Unauthorized: No userId found in token');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params; // 3) Extract id from the request parameters
        // Validate ObjectId format before attempting to delete
        if (!mongoose.isValidObjectId(id)) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Invalid ObjectId:', id);
            return res.status(400).json({ message: 'Invalid user id.' });
        }
        // 4) Prevent users from deleting their own account
        if (loggedInUserId === id) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] Users cannot delete their own account');
            return res.status(400).json({ message: 'Users cannot delete their own account' });
        }

        // 5) Atomic delete:same company, cannot delete admin users
        const removedUser = await User.findOneAndDelete({
            _id: id,
            admin: { $ne: true },   // Cannot delete admin users
        }).select('_id username admin');

        if (!removedUser) {
            console.error('[ERROR: userRoutes.js, /deleteUser/:id] User not found (or cannot be deleted).');
            return res.status(404).json({ success: false, message: 'User not found (or cannot be deleted).' });
        }

        // 6) Attempt to find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            console.error(`[ERROR: userRoutes.js, /deleteUser/:id] User with ID ${id} not found`);
            return res.status(404).json({ success: false,  message: 'User not found' });
        }

        console.log(`[INFO: userRoutes.js, /deleteUser/:id] User with ID ${id} deleted successfully`);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('[ERROR: userRoutes.js, /deleteUser/:id] Error deleting user:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


//Export the userRouter
module.exports = router