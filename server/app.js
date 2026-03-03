// app.js (server-side)
require('dotenv').config();
const ensureJwtSecret = require('./config/ensureJwtSecret')
ensureJwtSecret();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/connect');
const userRoutes = require('./routes/userRoutes')
const app = express()
//Extract enviromental variables
const port = process.env.PORT || 3001



if (!port) {
    console.error('[ERROR: app.js] Port enviromental variable is missing');//Log an error message in the console for debugging purposes
    process.exit(1)// Exit the Node.js process with a non-zero exit code (1)
}

// ========== CORS CONFIGURATION ==========
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200
};

//==============GLOBAL MIDDLEWAR=============

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOptions))
app.use(helmet())

//==============ROUTES=======================
// Prefix all route modules with their base path.
app.use('/users', userRoutes)
//==============MONGOOSE CONFIG============
mongoose.set('strictPopulate', false)
//=============START THE SERVER=============
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`[INFO: app.js] Server is running on port: ${port}`);
    })
}).catch((error) => {
    console.error('[ERROR: app.js] Database connection failed:', error);
    process.exit(1)
});