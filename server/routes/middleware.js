// middleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rawSecretKey = process.env.JWT_SECRET_KEY;
const secretKey = rawSecretKey || 'secretkey';

if (!rawSecretKey) {
    console.warn('JWT_SECRET_KEY is not set in the environment variables.');
}

const SALT_ROUNDS = 10;

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

// Export the middleware function to be used in other parts of the application
module.exports = {checkJwtToken}