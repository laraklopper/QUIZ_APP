// app.js (server-side)
/* Load environment variables from a .env 
file using the dotenv package*/
require('dotenv').config();
// Ensure that the JWT secret is set in the environment variables before starting the server. 
const ensureJwtSecret = require('./config/ensureJwtSecret')
ensureJwtSecret();
//Import required modules and packages 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
// Import the function to connect to the MongoDB database. 
const connectDB = require('./config/connect');
//Import Routes
const userRoutes = require('./routes/userRoutes')// Import user-related routes from the userRoutes module. This module likely contains route handlers for user registration, login, profile management, etc.
const quizRoutes = require('./routes/quizRoutes')// Import quiz-related routes from the quizRoutes module. This module likely contains route handlers for creating quizzes, fetching quizzes, updating quizzes, etc.
const scoreRoutes = require('./routes/scoreRoutes')// Import score-related routes from the scoreRoutes module. This module likely contains route handlers for submitting scores, fetching scores, etc.
// Create an instance of the Express application
const app = express();
//Extract enviromental variables
const port = process.env.PORT || 3001

//=========ENVIRONMENTAL VARIABLES CHECK========
// Conditional rendering to check for the presence of the PORT environment variable.
if (!port) {
    console.error('[ERROR: app.js] Port enviromental variable is missing');//Log an error message in the console for debugging purposes
    process.exit(1)// Exit the Node.js process with a non-zero exit code (1)
}


//==============GLOBAL MIDDLEWAR=============

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(helmet())

//==============ROUTES=======================
// Prefix all route modules with their base path.
app.use('/users', userRoutes);// All user-related routes will be prefixed with /users (e.g., /users/register, /users/login, etc.)
app.use('/quizzes', quizRoutes);// All quiz-related routes will be prefixed with /quizzes (e.g., /quizzes/create, /quizzes/:id, etc.)
app.use('/scores', scoreRoutes);// All score-related routes will be prefixed with /scores (e.g., /scores/fetchScores, /scores/:id, etc.)
//==============MONGOOSE CONFIG============
mongoose.set('strictPopulate', false); // Disable strict population to allow for more flexible population of referenced documents. This setting can help avoid issues when populating nested documents or when the schema structure is complex.

//=============START THE SERVER=============
// Connect to the MongoDB database and start the server only if the connection is successful. If the connection fails, log the error and exit the process.
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`[INFO: app.js] Server is running on port: ${port}`);
    })
}).catch((error) => {
    console.error('[ERROR: app.js] Database connection failed:', error);
    process.exit(1)
});