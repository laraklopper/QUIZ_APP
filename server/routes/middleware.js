// middleware.js
// Shared middleware functions for authentication, validation, and authorization.
// These are used across multiple routes to enforce security and business rules.
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//==============JWT Config===================
const rawSecretKey = process.env.JWT_SECRET_KEY;
// Fall back to a hardcoded key only in development; production must set JWT_SECRET_KEY
const secretKey = rawSecretKey || 'secretkey';

// Warn at startup if the secret key is missing from the environment
if (!rawSecretKey) {
    console.warn('JWT_SECRET_KEY is not set in the environment variables.');
}
// 10 salt rounds is the industry standard — balances security strength and hashing speed
const SALT_ROUNDS = 10; // Number of hashing rounds

/*=============================
JWT VERIFICATION MIDDLEWARE
 ====================================*/
// Verifies the JWT token sent in the Authorization header.
// Attaches the decoded user payload to req.user so downstream routes
// can access the authenticated user's id, role, etc. without re-querying the DB.
const checkJwtToken = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization || '';

        // Token must follow the "Bearer <token>" format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('[WARN: middleware.js ,checkJwtToken] Authorization header missing or malformed');
            return res.status(401).json( {
                    success: false,
                    message: 'Access denied. No token provided.'
                });
        }

        // Extract the token string after "Bearer "
        const token = authHeader.split(' ')[1];
        if (!token) {
            console.warn('[WARN: middleware.js ,checkJwtToken] Token missing in Authorization header');
            return res.status(401).json( {
                    success: false,
                    message: 'Access denied. No token provided.'
                });
        }

        // Verify signature and expiry; throws if invalid
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded token payload to request object
        console.log('[SUCCESS: middleware.js, checkJwtToken ]: Token provided');

        next(); // Token is valid — proceed to the next middleware or route handler
    } catch (error) {
         console.error('[ERROR: middleware.js] No token attatched to the request', error.message);
          // Provide specific error messages based on JWT error type
        if (error.name === 'TokenExpiredError') {
            // Token was valid but has passed its expiry time
            console.error('[ERROR: middleware.js, checkJwtToken]: Token expired');
            return res.status(401).json({
                success: false, message: 'Token has expired. Please login again.'
            });
        } else if (error.name === 'JsonWebTokenError') {
            // Token signature is wrong or the token is malformed
            console.error('[ERROR: middleware.js, checkJwtToken]: Invalid token');
            return res.status(401).json({
                success: false, message: 'Invalid token. Please login again.'
            });
        }
        // Catch-all for any other JWT-related errors
        return res.status(401).json({
            success: false, message: 'Invalid or expired token.'
        });
    }
}
/*===============================
PASSWORD VALIDATION MIDDLEWARE
=========================*/
// Hashes the plain-text password in req.body before it reaches the route handler,
// so the database never stores a plain-text password.
// Handles two cases:
//   - Registration / login:     req.body.password    → hashed in place
//   - Password change requests: req.body.newPassword → hashed in place
const hashPassword = async (req, res, next) => {
    try {
        const {password, newPassword} = req.body || {};

        // Registration path: only password is present (no newPassword)
        if (password && !newPassword) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            req.body.password = hashedPassword; // Replace plain password with hashed version
            console.log('[INFO: middleware.js, hashPassword] Password hashed for registration/login');
        }
        // Password-change path: newPassword takes priority
        else if (newPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            req.body.newPassword = hashedNewPassword; // Replace plain new password with hashed version
            console.log('[INFO: middleware.js, hashPassword] New password hashed for password change');
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('[ERROR: middleware.js, hashPassword]:', error.message);
        return res.status(500).json({ message: 'Error processing password' });
    }
};
// Rejects passwords that don't meet minimum strength requirements:
//   - At least 8 characters
//   - At least one special character (!@#$%^&*(),.?":{}|<>)
// Must run BEFORE hashPassword so the plain-text value is still available for testing.
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

    // Regex breakdown:
    //   (?=.*[!@#$%^&*(),.?":{}|<>])  — lookahead: must contain at least one special character
    //   .{8,}                          — total length must be at least 8 characters
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
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
// Ensures the user is at least 18 years old before allowing registration.
// Expects req.body.dateOfBirth as a parseable date string (e.g. "YYYY-MM-DD").
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
        // Reject unparseable date strings
        if (isNaN(dob.getTime())) {
            console.error('[ERROR: middleware.js, checkAge]: Invalid date format for dateOfBirth');
            return res.status(400).json({
                success: false,
                message: 'Invalid date format for date of birth'
            });
        }
        const now = new Date();
        // A future date of birth is impossible
        if (dob > now) {
            console.error('[ERROR: middleware.js, checkAge]: Date of birth cannot be in the future');
            return res.status(400).json({
                success: false,
                message: 'Date of birth cannot be in the future'
            });
        }

        // Calculate exact age in years.
        // Subtract 1 if the birthday hasn't occurred yet this calendar year.
        const years =
            now.getFullYear() -
            dob.getFullYear() -
            (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        console.log('[DEBUG: middleware.js, checkAge] Calculated user age:', years);

        const MIN_AGE = 18; // Minimum age requirement
        if (years < MIN_AGE) {
            console.error(`[ERROR: middleware.js, checkAge]: You must be at least ${MIN_AGE} years old.`)
            return res.status(400).json({
                success: false,
                message: `You must be at least ${MIN_AGE} years old.`
            });
        }

        next(); // Age requirement met — proceed
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