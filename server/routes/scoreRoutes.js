// scoreRoute.js
const express = require('express');// Import express to create a router for handling quiz score-related routes
//Import the necessary models and middleware to handle quiz scores and user authentication
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId formats
const Score = require('../models/scoreSchema'); // Import the Score model to interact with the scores collection in the database
const Quiz = require('../models/quizSchema'); // Import the Quiz model to check for existing quizzes when fetching scores
const User = require('../models/userSchema'); // Import the User model to check for existing users when fetching scores
//Import custom middleware
const {checkJwtToken} = require('./middleware'); // Import the checkJwtToken middleware 
//Ceate a new router instance to define the routes for handling quiz scores
const router = express.Router();// Create a new router instance to define the routes for handling quiz scores

//===========ROUTES===============
//-----------GET----------------

// -------Route 1: GET /fetchScores-------
// Fetches all scores, or scores filtered by username if provided as a query param.
// Also performs a cleanup pass — removing stale scores whose quiz or user no longer exists.
// Requires a valid JWT token (checkJwtToken middleware).
// Example: GET /fetchScores?username=john
router.get('/fetchScores', checkJwtToken, async (req, res) => {
    try {
        // Extract optional username filter from the query string
        const {username} = req.query;

        // Validate that username, if provided, is a string (guards against array injection e.g. ?username[]=foo)
        if (username && typeof username !== 'string') {
            console.error('[scoreRoutes.js:] Invalid username format. Username must be a string.');
            return res.status(400).json({ success: false, message: 'Invalid username format. Username must be a string.' });
        }

        // Fetch all existing quiz titles — used below to detect orphaned score records
        let quizTitles = await Quiz.find().select('title').exec();
        let existingTitles = quizTitles.map(quiz => quiz.title);

        // Fetch all existing usernames — used below to detect orphaned score records
        let userNames = await User.find().select('username').exec();
        let existingUsernames = userNames.map(user => user.username);

        /* Cleanup: Remove any Score documents whose associated quiz or user
           has since been deleted. This keeps the scores collection in sync. */
        await Score.deleteMany({
            $or: [
                { quizTitle: { $nin: existingTitles } },   // Quiz was deleted
                { username: { $nin: existingUsernames } }   // User was deleted
            ]
        });

        console.log(existingTitles);     // Log existing quiz titles for debugging
        console.log(existingUsernames);  // Log existing usernames for debugging

        // Declare a variable to hold the query results
        let quizScores;

        // If a username was provided, return only that user's scores; otherwise return all scores
        if (username) {
            quizScores = await Score.find({ username }).exec(); // Filtered by username
        } else {
            quizScores = await Score.find({}).exec(); // All scores
        }

        console.log(quizScores); // Log fetched scores for debugging
        return res.status(200).json({ success: true, scores: quizScores }); // Respond with the scores
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js:] An error occurred while fetching scores.', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching scores.', error: error.message });
    }
});

// -------Route 2: GET /findScores/:username-------
// Fetches all scores belonging to a specific user, sorted newest first.
// First verifies the user exists in the database before querying scores.
// Example: GET /findScores/john
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from the URL parameter

        // Validate that username is present and is a string
        if (!username || typeof username !== 'string') {
            console.error(
                '[scoreRoutes.js, /findScores/:username] Invalid username format. Username must be a string.'
            );
            return res.status(400).json({ success: false, message: 'Invalid username format. Username must be a string.' });
        }

        // Look up the user in the database to confirm they exist before fetching their scores
        const user = await User.findOne({ username })
            .exec(); // Execute the query

        // If the user does not exist, return a 404 error
        if (!user) {
            console.error(`[scoreRoutes.js, /findScores/:username] User not found: ${username}`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Fetch all scores for the confirmed user, sorted by most recent first
        const result = await Score.find({ username: user.username })
            .sort({ createdAt: -1 }) // Descending order — newest score appears first
            .exec(); // Execute the query

        res.status(200).json({ userScores: result }); // Return the user's scores
        console.log(result); // Log results for debugging
    } catch (error) {
        console.error(
            '[ERROR: scoreRoutes.js, /findScores/:username] An error occurred while fetching user scores.', error);
        res.status(500).json(
            {
                success: false,
                message: 'An error occurred while fetching user scores.', error: error.message
            });
    }
})

// -------Route 3: GET /findScore/:username/:quizTitle-------
// Fetches a single score for a specific user and quiz combination.
// Returns 404 if no matching score record is found.
// Example: GET /findScore/john/JavaScript%20Basics
router.get('/findScore/:username/:quizTitle', async (req, res) => {
    try {
        const { username, quizTitle } = req.params; // Extract both username and quiz title from URL params

        // Query the Score collection for a document matching both username and quizTitle
        const result = await Score.findOne({ username, quizTitle }).exec();

        // If no score exists for this user/quiz pair, return a 404 error
        if (!result) {
            console.error(
                `[scoreRoutes.js, /findScore/:username/:quizTitle] Score not found for user ${username} and quiz ${quizTitle}`
            );
            return res.status(404).json(
                { success: false, message: 'Score not found for this user and quiz.' }
            );
        }

        res.status(200).json({ userScore: result }); // Return the matched score
        console.log(result); // Log the result for debugging
    } catch (error) {
        console.error(
            '[ERROR: scoreRoutes.js, /findScore/:username/:quizTitle] An error occurred while fetching the user score for the specified quiz.', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the user score for the specified quiz.', error: error.message });
    }
})
//-----------POST---------------
//Route to submit a quiz score
//send a POST request to /submitScore endpoint with the username, quiz title, and score in the request body to submit a new score for a quiz
router.post('/submitScore', async (req, res) => {
    try{
        const { username, quizTitle, score } = req.body;// Extract the username, quiz title, and score from the request body

        // Conditional rendering to check if the required fields are present and valid
        if (!username || typeof username !== 'string' || !quizTitle || typeof quizTitle !== 'string' || score === undefined || typeof score !== 'number') {
            console.error('[scoreRoutes.js, /submitScore] Invalid input. Username and quiz title must be strings, and score must be a number.');
            return res.status(400).json({ success: false, message: 'Invalid input. Username and quiz title must be strings, and score must be a number.' });
        }

        // Check if the quiz exists
        const quiz = await Quiz.findOne({ title: quizTitle }).exec();
        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            console.error(`[scoreRoutes.js, /submitScore] Quiz not found: ${quizTitle}`);
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        //Check if a score already exists for the quiz    
        const existingScore = await Score.findOne({ username, quizTitle }).exec();

        // Conditional rendering to Check if a score already exists for the user and the quiz
        if (existingScore) {
            console.error(`[scoreRoutes.js, /submitScore] Score already exists for user ${username} and quiz ${quizTitle}`);
            return res.status(400).json({ success: false, message: 'Score already exists for this user and quiz.' });
        }

        const newScore = await new Score({ username, quizTitle, score }).save();// Create a new score
        res.status(201).json(newScore);// Return the new score in JSON format
       
    //Log the score in the console for debugging purposes
        console.log(`Score submitted: ${username} scored ${score} on quiz ${quizTitle}`);
    }
    catch (error) {
        console.error(// Log an error message in the console for debugging purposes
            '[ERROR: scoreRoutes.js, /submitScore] An error occurred while submitting the score.', error);
        res.status(500).json(// Respond with a 500 (Internal Server Error) status
            { 
                success: false, 
                message: 'An error occurred while submitting the score.', error: error.message 
            });
    }
});
//----------PUT----------------
// Route to update a UserScore
// Send a PUT request to the  /updateScore/:id endpoint with the score ID as a parameter and the new score in the request body to update an existing score
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Extract the score ID from the request parameters
        const { score } = req.body;// Extract the new score from the request body

        //Conditional rendering to check that the Id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error(`[scoreRoutes.js, /updateScore/:id] Invalid score ID format: ${id}`);//Log an error message in the console for debugging purposes    
                return res.status(400).json({ success: false, message: 'Invalid score ID format.' });
            }


        //Conditional rendering to check if the score is a 0 or a positive number
            if (typeof score !== 'number' || score < 0) {
                console.error(`[scoreRoutes.js, /updateScore/:id] Invalid score value: ${score}. Score must be a non-negative number.`);
                return res.status(400).json({ success: false, message: 'Invalid score value. Score must be a non-negative number.' });
            }
        
           const existingScore = await Score.findById(id).exec();// Find existing score by id
         //Conditional rendering to check if the score was found
            if (!existingScore) {
                console.error(`[scoreRoutes.js, /updateScore/:id] Score not found with ID: ${id}`);
                // If no score is found, return a 404 (Not Found) error
                return res.status(404).json({ success: false, message: 'Score not found.' });
            }
             // Conditional rendering to check if new score is higher
            if (existingScore.score >= score) {
                console.log(`[scoreRoutes.js, /updateScore/:id] Existing score (${existingScore.score}) is higher than or equal to new score (${score}). No update performed.`);
                // If the new score is not higher than the existing score, return early
                return res.status(200).json({ success: false, message: 'New score is not higher than the existing score' });
                }

                 // Find the score by its ID and update it
                const editedScore = await Score.findByIdAndUpdate(
                    id,//Score id
                    { score, $inc: { attempts: 1 } },// Increment attempts 
                    { new: true } //Return the updated document
                );
        
         console.log(`[scoreRoutes.js, /updateScore/:id] Updated score for user ${existingScore.username} on quiz ${existingScore.quizId}`);//Log the edited score in the console for debugging purposes              
        return res.status(200).json(editedScore); // Return the updated score in JSON format
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js, /updateScore/:id] An error occurred while updating the score.', error);//Log an error message in the console for debugging purposes    
        res.status(500).json({ success: false, message: 'An error occurred while updating the score.', error: error.message });// Return 500 (Internal Server Error) status code for server error
    }
})

// Export the router to be used in other parts of the application
module.exports = router;