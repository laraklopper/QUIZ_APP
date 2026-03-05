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

/*================================
REQUEST LIMIT MIDDLEWARE
===============================*/

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
    const { password } = req.body || {};
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; // Minimum 8 characters and at least one special character
    if (!passwordRegex.test(password)) {
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
// Export the middleware function to be used in other parts of the application
module.exports = {checkJwtToken, hashPassword, checkPasswordStrength};