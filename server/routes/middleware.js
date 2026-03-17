// middleware.js
// Shared middleware functions for authentication, validation, and authorization.
// These are used across multiple routes to enforce security and business rules.
/* Load environment variables from a .env 
file using the dotenv package*/
require('dotenv').config();
//Import required modules and packages
const jwt = require('jsonwebtoken');// Import the jsonwebtoken module for handling JSON Web Tokens
const bcrypt = require('bcrypt');// Import bcrypt for password hashing 

//==============JWT Config===================
const rawSecretKey = process.env.JWT_SECRET_KEY;//Extract the JWT_SECRET_KEY from enviromental variables
// Fall back to a hardcoded key only in development; production must set JWT_SECRET_KEY
const secretKey = rawSecretKey || 'secretkey';

// Warn at startup if the secret key is missing from the environment
if (!rawSecretKey) {
    console.warn('JWT_SECRET_KEY is not set in the environment variables.');// Log a warning message in the console for debugging purposes
}
// 10 salt rounds is the industry standard — balances security strength and hashing speed
const SALT_ROUNDS = 10; // Number of hashing rounds (can increase for more security)

/*=============================
JWT VERIFICATION MIDDLEWARE
 ====================================*/
//Middleware function to check and verify a JWT token from the 'token' header
// Attaches the decoded user payload to req.user so downstream routes
// can access the authenticated user's id, etc. without re-querying the DB.
const checkJwtToken = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization || ''; // Retrieve the authorization header from the request
        // default to empty string so .startsWith() is safe to call

        /*Conditional rendering to check if the header exists 
        and follows "Bearer <token>" format*/
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn(// Log a warning message in the console for debugging purposes
                '[WARN: middleware.js ,checkJwtToken] Authorization header missing or malformed');
            return res.status(401).json( {// Respond with a 401 (Unauthorised) status code and a json error message
                    success: false,
                    message: 'Access denied. No token provided.'
                });
        }

        const token = authHeader.split(' ')[1];// Extract the actual token part after "Bearer "

        // Conditional rendering to check if the token exists
        if (!token) {// Extra safety check: ensure token string is not empty
            console.warn(//Log an waring message in the console for debugging purposes
                '[WARN: middleware.js ,checkJwtToken] Token missing in Authorization header');
            return res.status(401).json( {// Respond with a 401 (Unauthorised) status code and an error message
                    success: false,
                    message: 'Access denied. No token provided.'
                });
        }

        // Verify signature and expiry; throws if invalid
        const decoded = jwt.verify(token, secretKey);// Verify and decode the JWT using the secret key
        req.user = decoded; // Attach decoded token payload to request object
        console.log('[SUCCESS: middleware.js, checkJwtToken ]: Token provided');//Log a message in the console for debugging purposes

        next(); // Call the next middleware or route handler if the token is valid
    } catch (error) {
         console.error('[ERROR: middleware.js] No token attatched to the request', error.message);
          // Provide specific error messages based on JWT error type
        if (error.name === 'TokenExpiredError') {
            // Token was valid but has passed its expiry time
            console.error('[ERROR: middleware.js, checkJwtToken]: Token expired');
            return res.status(401).json({// Respond with a 401 (Unauthorised) status code and an error message
                success: false, message: 'Token has expired. Please login again.'
            });
        } else if (error.name === 'JsonWebTokenError') {
            // Token signature is wrong or the token is malformed
            console.error('[ERROR: middleware.js, checkJwtToken]: Invalid token');
            return res.status(401).json({// Respond with a 401 (Unauthorised) status code and an error message
                success: false, message: 'Invalid token. Please login again.'
            });
        }
        // Catch-all for any other JWT-related errors
        return res.status(401).json({// Respond with a 401 (Unauthorised) status code and an error message
            success: false, message: 'Invalid or expired token.'
        });
    }
}
/*===============================
PASSWORD VALIDATION MIDDLEWARE
=========================*/
/*Middleware to hash password before registration or password changes
   Expects req.body.password to be present*/
/* Hashes the plain-text password in req.body before it 
reaches the route handler, so the database never 
stores a plain-text password.*/
// Handles two cases:
//   - Registration / login:     req.body.password    → hashed in place
//   - Password change requests: req.body.newPassword → hashed in place
const hashPassword = async (req, res, next) => {
    try {
        const {password, newPassword} = req.body || {}; // || {} prevents a destructure crash if body is undefined

        // Registration path: only password is present (no newPassword)
        if (password && !newPassword) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            req.body.password = hashedPassword; // Replace plain password with hashed version
            console.log('[INFO: middleware.js, hashPassword] Password hashed for registration/login');//Log a message in the console for debugging purposes
        }
        // Password-change path: newPassword takes priority
        else if (newPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            req.body.newPassword = hashedNewPassword; // Replace plain new password with hashed version
            console.log('[INFO: middleware.js, hashPassword] New password hashed for password change');
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // bcrypt.hash() can reject if SALT_ROUNDS is invalid or the input is not a string
        console.error('[ERROR: middleware.js, hashPassword]:', error.message);
        return res.status(500).json({ message: 'Error processing password' });// Send a 500 (Internal Server Error) status code with an error message
    }
};
//Middleware to check the password strengh
// Rejects passwords that don't meet minimum strength requirements:
//   - At least 8 characters
//   - At least one special character (!@#$%^&*(),.?":{}|<>)
// Must run BEFORE hashPassword so the plain-text value is still available for testing.
const checkPasswordStrength = (req, res, next) => {
    console.log('[INFO: middleware.js, checkPasswordStrength] Validating password strength');//Log a message in the console for debugging purposes
    // Support both registration (password) and password change (newPassword)
    const pwd = req.body?.password ?? req.body?.newPassword; // ?? falls back to newPassword only if password is null/undefined

    //Conditional rendering to check if password input is provided and is a string
    // guards against missing body fields or non-string values (e.g. numbers)
    if (typeof pwd !== 'string') { 
        //Log an error message in the console for debugging purposes
        console.error('[ERROR: middleware.js, checkPasswordStrength]: Password is required and must be a string');
        return res.status(400).json({// Respond with a 400 (Bad Request) status and a json error message
            success: false, message: 'Password is required and must be a string'
        });
    }

    // Regex breakdown:
    //   (?=.*[!@#$%^&*(),.?":{}|<>])  — lookahead: must contain at least one special character
    //   .{8,}                          — total length must be at least 8 characters
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    //Conditional rendering to test the password against the regular expression
    if (!passwordRegex.test(pwd)) {
        console.error('[ERROR: middleware.js, checkPasswordStrength] Weak password');//Log an error message in the console for debugging purposes
        return res.status(400).json(// Respond with a 400 (Bad Request) status and an error message
            {success: false, message: 'Password must be at least 8 characters long and contain at least one special character.'});
    }
    next();// Call the next middleware or route handler
};  
/*====================================
AGE VALIDATION MIDDLEWARE
========================*/
// Middleware to ensures the user is at least 18 years old before allowing registration.
// Expects req.body.dateOfBirth as a parseable date string (e.g. "YYYY-MM-DD").
const checkAge = (req, res, next) => {
    console.log('[DEBUG: middleware.js, checkAge] Validating user age');//Log a message in the console for debugging purposes
    try {
        const {dateOfBirth} = req.body || {};// Extract the date of birth from the request body

        console.log(// Log user dateOfBirth and a message in the console for debugging purposes
            '[DEBUG: middleware.js, checkAge] Received dateOfBirth:', dateOfBirth);

        // Conditional rendering to check if the date of birth is provided in the request body
        if (!dateOfBirth) {
            console.error('[ERROR: middleware.js, checkAge]: Date of birth is required');//Log an error message in the console for debugging purposes
            return res.status(400).json(// Respond with a 400 (Bad Request) status code if Date Of Birth is missing
                {success: false,message: 'Date of birth is required'}
            );
        }

        const dob = new Date(dateOfBirth);
        // Reject unparseable date strings
        if (isNaN(dob.getTime())) {
            //Log an error message in the console for debugging purposes
            console.error('[ERROR: middleware.js, checkAge]: Invalid date format for dateOfBirth');
            return res.status(400).json(// Respond with a 400 (Bad Request) status if date of birth is invalid
                {success: false, message: 'Invalid date format for date of birth'}
            );
        }
        const now = new Date();
        // Conditional rendering to ensure the Date
        if (dob > now) {
            //Log an error message in the console for debugging purposes
            console.error('[ERROR: middleware.js, checkAge]: Date of birth cannot be in the future');
            return res.status(400).json(// Respond with a 400 (Bad Request) status if future date
                {success: false,message: 'Date of birth cannot be in the future'});
        }

        // Calculate exact age in years.
        // Subtract 1 if the birthday hasn't occurred yet this calendar year.
        const years =
            now.getFullYear() -
            dob.getFullYear() -
            (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        console.log('[DEBUG: middleware.js, checkAge] Calculated user age:', years);

        const MIN_AGE = 18; // Minimum age requirement
        // Conditional rendering to check if the calculated age is less than 18
        if (years < MIN_AGE) {
            //Log an error message in the console for debugging purposes
            console.error(`[ERROR: middleware.js, checkAge]: You must be at least ${MIN_AGE} years old.`)
            return res.status(400).json({// Respond with a 400 (Bad Request) status if underage
                success: false,
                message: `You must be at least ${MIN_AGE} years old.`
            });
        }

        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('[ERROR: middleware.js, checkAge]:', error.message);//Log an error message in the console for debugging purposes
        return res.status(500).json({// Return a 500 (Internal Server Error) status code with a message
            success: false,
            message: 'Error validating user age'
        });
    }
}
/*========================
ADMIN MIDDLEWARE
==========================*/
// Restricts a route to admin users only.
// Must run after checkJwtToken so that req.user is already populated
// with the decoded JWT payload (which includes the isAdmin flag).
const checkAdmin = (req, res, next) => {
    console.log('[DEBUG: middleware.js, checkAdmin] Checking user role for admin access');//Log a message in the console for debugging purposes
    try {
        // isAdmin is embedded in the JWT payload at login time by the auth route
        const isAdmin = req.user?.isAdmin; // req.user is set by checkJwtToken upstream

        if (!isAdmin) { // falsy covers both false and undefined (e.g. non-admin users)
            console.error('[ERROR: middleware.js, checkAdmin]: User is not an admin');//Log an error message in the console for debugging purposes
            return res.status(403).json({ // 403 Forbidden — authenticated but not authorised
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        next(); // User has admin privileges — proceed to the route handler
    } catch (error) {
        // Unexpected errors (e.g. req.user missing entirely due to middleware order issue)
        console.error('[ERROR: middleware.js, checkAdmin]:', error.message);//Log an error message in the console for debugging purposes
        return res.status(500).json({// Return a 500 (Internal Server Error) status code with a message
            success: false,
            message: 'Error validating admin privileges'
        });
    }
};
//=====================EXPORT MIDDLEWARE===================================
// Export the middleware function to be used in other parts of the application
module.exports = {checkJwtToken, hashPassword, checkPasswordStrength, checkAge, checkAdmin};