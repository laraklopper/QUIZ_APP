// middleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//==============JWT Config===================
const rawSecretKey = process.env.JWT_SECRET_KEY;
const secretKey = rawSecretKey || 'secretkey';

// Conditional rendering to checK if enviromental variables are present
if (!rawSecretKey) {
    console.warn('JWT_SECRET_KEY is not set in the environment variables.');
}
// Industry standard, balances security and performance
const SALT_ROUNDS = 10;// Number of hashing rounds

/*=============================
JWT VERIFICATION MIDDLEWARE
 ====================================*/ 
// Middleware to authenticate JWT token
const checkJwtToken = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization || '';

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('[WARN: middleware.js ,checkJwtToken] Authorization header missing or malformed');
            return res.status(401).json( { 
                    success: false,
                    message: 'Access denied. No token provided.' 
                });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.warn('[WARN: middleware.js ,checkJwtToken] Token missing in Authorization header');
            return res.status(401).json( { 
                    success: false,
                    message: 'Access denied. No token provided.' 
                });
        }

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded token to request object
        console.log('[SUCCESS: middleware.js, checkJwtToken ]: Token provided');
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
         console.error('[ERROR: middleware.js] No token attatched to the request', error.message);
          // Provide specific error messages based on JWT error type
        if (error.name === 'TokenExpiredError') {
            console.error('[ERROR: middleware.js, checkJwtToken]: Token expired');
            return res.status(401).json({ // Respond with a 401 (Unauthorized) status code with an error message 
                success: false, message: 'Token has expired. Please login again.'
            });
        } else if (error.name === 'JsonWebTokenError') {
            console.error('[ERROR: middleware.js, checkJwtToken]: Invalid token');
            return res.status(401).json({ // Respond with a 401 (Unauthorized) status code with an error message 
                success: false, message: 'Invalid token. Please login again.'
            });
        }
        return res.status(401).json({// Respond with a 401 (Unauthorized) status code with an error message 
            success: false, message: 'Invalid or expired token.'
        });
    }
}
/*===============================
PASSWORD VALIDATION MIDDLEWARE
=========================*/
/*Middleware to hash password before registration or password changes
 * Expects req.body.password to be present*/
const hashPassword = async (req, res, next) => {
    try {
        const {password, newPassword} = req.body || {};

        if (password && !newPassword) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            req.body.password = hashedPassword; // Replace plain password with hashed version   
            console.log('[INFO: middleware.js, hashPassword] Password hashed for registration/login'); 
        }
        // Hash new password for password changes
        else if (newPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            req.body.newPassword = hashedNewPassword;// Replace plain new password with hashed version
            console.log('[INFO: middleware.js, hashPassword] New password hashed for password change');
        }
        next();// Proceed to the next middleware or route handler
    } catch (error) {
        console.error('[ERROR: middleware.js, hashPassword]:', error.message);
        return res.status(500).json({ message: 'Error processing password' });
    }
};
/*Middleware to ensure that the password has a minimum of 
eight characters and at least one special character*/
const checkPasswordStrength = (req, res, next) => {
    console.log('[INFO: middleware.js, checkPasswordStrength] Validating password strength');
     // Support both registration (password) and password change (newPassword)
    const pwd = req.body?.password ?? req.body?.newPassword;

    if (typeof pwd !== 'string') {
        console.error('[ERROR: middleware.js, checkPasswordStrength]: Password is required and must be a string');
        return res.status(400).json({
            success: false,
            message: 'Password is required and must be a string'
        }); 
    }
  
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; // Minimum 8 characters and at least one special character
    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long and contain at least one special character.'
        });
    }
    next();
};  
/*====================================
AGE VALIDATION MIDDLEWARE
========================*/
//Middleware function to check that user age
/*Only users 18 or older can register */
const checkAge = (req, res, next) => {  
    console.log('[DEBUG: middleware.js, checkAge] Validating user age');
    try {
        const {dateOfBirth} = req.body || {};

        console.log('[DEBUG: middleware.js, checkAge] Received dateOfBirth:', dateOfBirth);

        if (!dateOfBirth) {
            console.error('[ERROR: middleware.js, checkAge]: Date of birth is required');
            return res.status(400).json({
                success: false,
                message: 'Date of birth is required'
            });
        }

        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime())) {
            console.error('[ERROR: middleware.js, checkAge]: Invalid date format for dateOfBirth');
            return res.status(400).json({
                success: false,
                message: 'Invalid date format for date of birth'
            });
        }
        const now = new Date();
        if (dob > now) {
            console.error('[ERROR: middleware.js, checkAge]: Date of birth cannot be in the future');
            return res.status(400).json({
                success: false,
                message: 'Date of birth cannot be in the future'
            });
        }
          // Calculate user age
        const years =
            now.getFullYear() -
            dob.getFullYear() -
            (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        console.log('[DEBUG: middleware.js, checkAge] Calculated user age:', years);

        const MIN_AGE = 18;// Define minimum age requirement
        // Conditional rendering to check if user meets age requirement
        if (years < MIN_AGE) {
            console.error(`[ERROR: middleware.js, checkAge]: You must be at least ${MIN_AGE} years old.`)
            return res.status(400).json({
                success: false,
                message: `You must be at least ${MIN_AGE} years old.` })
        }

        next();
    } catch (error) {
        console.error('[ERROR: middleware.js, checkAge]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error validating user age'
        });
    }
    
}
/*========================
ADMIN MIDDLEWARE
==========================*/
//Middleware to allow admin users admin privilesges to access certain routes
//Only allow users 18 or older to register as admins
const checkAdmin = (req, res, next) => {
    console.log('[DEBUG: middleware.js, checkAdmin] Checking user role for admin access');
    try {
        const isAdmin = req.user?.isAdmin;
        if (!isAdmin) {
            console.error('[ERROR: middleware.js, checkAdmin]: User is not an admin');
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        console.error('[ERROR: middleware.js, checkAdmin]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error validating admin privileges'
        });
    }
};
//=====================EXPORT MIDDLEWARE===================================
// Export the middleware function to be used in other parts of the application
module.exports = {checkJwtToken, hashPassword, checkPasswordStrength, checkAge, checkAdmin};