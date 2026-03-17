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
/*-----------GET----------------
GET:READ : Used to fetch information from the database
-----------------------------*/
// -------Route 1: GET /fetchScores-------
// Fetches all scores, or scores filtered by username if provided as a query param.
// Also performs a cleanup pass — removing stale scores whose quiz or user no longer exists.
// Requires a valid JWT token (checkJwtToken middleware).
router.get('/fetchScores', checkJwtToken, async (req, res) => {
    try {
        // Extract optional username filter from the query string
        const {username} = req.query;

        // Conditional rendering to check that username, if provided, is a string (guards against array injection e.g. ?username[]=foo)
        if (username && typeof username !== 'string') {
            console.error('[scoreRoutes.js:] Invalid username format. Username must be a string.');
            return res.status(400).json({ success: false, message: 'Invalid username format. Username must be a string.' });
        }

        // Fetch all existing quiz titles — used below to detect orphaned score records
        let quizTitles = await Quiz.find().select('title').exec();
        let existingTitles = quizTitles.map(quiz => quiz.title);// Extract quiz titles into an array

        // Fetch all existing usernames — used below to detect orphaned score records
        let userNames = await User.find().select('username').exec();
        let existingUsernames = userNames.map(user => user.username);//Extract usernames into an array

        /* Cleanup: Remove any Score documents whose associated quiz or user
           has since been deleted. This keeps the scores collection in sync. */
        await Score.deleteMany({
            $or: [
                { quizTitle: { $nin: existingTitles } },   // Delete scores with quiz title not in existingTitles 
                { username: { $nin: existingUsernames } }   // Delete scores with usernames not in existing usernames
            ]
        });

        console.log(existingTitles);     // Log existing quiz titles for debugging
        console.log(existingUsernames);  // Log existing usernames for debugging

        // Declare a variable to hold the query results
        let quizScores;

         // Conditional rendering to check if a username is provided
       
        if (username) {// Filtered by username
            // Find all scores for the user based on the username
            quizScores = await Score.find({ username }).exec(); 
        } else {// All scores
            //Find all scores if no username is provided
            quizScores = await Score.find({}).exec(); 
        }

        console.log(`[RESPONSE: scoreRoutes.js, /fetchScores]: ${quizScores}`); // Log fetched scores in the console for debugging purposes
        return res.status(200).json({ success: true, scores: quizScores }); // Respond with the scores
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js:] An error occurred while fetching scores.', error);//Log an error message in the console for debugging purposes    
        res.status(500).json({ success: false, message: 'An error occurred while fetching scores.', error: error.message });
    }
});

// -------Route 2: GET /findScores/:username-------
// Fetches all scores belonging to a specific user, sorted newest first.
// First verifies the user exists in the database before querying scores.
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
        res.status(500).json(// Return a 500 (Internal Server Error) status code with a message
            {
                success: false,
                message: 'An error occurred while fetching user scores.', error: error.message
            });
    }
})

// -------Route 3: GET /findScore/:username/:quizTitle-------
// Fetches a single score for a specific user and quiz combination.
// Returns 404 if no matching score record is found.
router.get('/findScore/:username/:quizTitle', async (req, res) => {
    try {
        const { username, quizTitle } = req.params; // Extract both username and quiz title from URL params

        // Query the Score collection for a document matching both username and quizTitle
        const result = await Score.findOne({ username, quizTitle }).exec();

        //Conditional rendering to check if a score is found for the user and quiz
        if (!result) {
            console.error(//Log an error message in the console for debugging purposes
                `[scoreRoutes.js, /findScore/:username/:quizTitle] Score not found for user ${username} and quiz ${quizTitle}`
            );
            return res.status(404).json( //  If no score exists for this user/quiz pair, return a 404 (Not Found) status code with an error message
                { success: false, message: 'Score not found for this user and quiz.' }
            );
        }

        res.status(200).json({ userScore: result }); // Return a status 200 (OK) response and the matched score  in JSON format
        console.log(result); // Log the result for debugging purposes
    } catch (error) {
        console.error(//Log an error message in the console for debugging purposes
            '[ERROR: scoreRoutes.js, /findScore/:username/:quizTitle] An error occurred while fetching the user score for the specified quiz.', error);
        res.status(500).json(// Return a 500 (Internal Server Error) status code with a message
            { 
                success: false, 
                message: 'An error occurred while fetching the user score for the specified quiz.', error: error.message });
    }
})
/*-------POST--------------
POST: CREATE: Used to submit data about a specific entity to the server
-----------------------*/
// -------Route 4: POST /submitScore-------
// Creates a new score record for a user on a specific quiz.
// Validates input, confirms the quiz exists, and prevents duplicate entries
// (one score per user per quiz — use PUT /updateScore to update an existing one).
router.post('/submitScore', async (req, res) => {
    try{
        // Extract the required fields from the request body
        const { username, quizTitle, score } = req.body;

        // Conditional rendering to check all required fields: username and quizTitle must be non-empty strings,
        // score must be a number (allows 0 as a valid score via strict undefined check)
        if (!username || typeof username !== 'string' || !quizTitle || typeof quizTitle !== 'string' || score === undefined || typeof score !== 'number') {
            console.error('[scoreRoutes.js, /submitScore] Invalid input. Username and quiz title must be strings, and score must be a number.');
            return res.status(400).json({ success: false, message: 'Invalid input. Username and quiz title must be strings, and score must be a number.' });
        }

        // Verify the quiz exists before saving a score against it
        const quiz = await Quiz.findOne({ title: quizTitle }).exec();
        // Conditional rendering to check if the quiz exists
        if (!quiz) {
            //Log an error message in the console for debugging purposes
            console.error(`[scoreRoutes.js, /submitScore] Quiz not found: ${quizTitle}`);
            // Return 404 (Not Found) response status if the quiz title does not match any quiz in the database
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        // Check whether this user already has a score for this quiz
        // Each user is limited to one score record per quiz — duplicates are rejected here
        const existingScore = await Score.findOne({ username, quizTitle }).exec();
        if (existingScore) {
            // Return 400 if a score record already exists; client should use PUT to update it
            console.error(`[scoreRoutes.js, /submitScore] Score already exists for user ${username} and quiz ${quizTitle}`);
            return res.status(400).json(// Send a 400 (Bad Request) status code with a message
                { success: false, message: 'Score already exists for this user and quiz.' });
        }

        // All checks passed — create and persist the new score document
        const newScore = await new Score({ username, quizTitle, score }).save();
        res.status(201).json(newScore); // Respond with 201 (Created) and the saved score document

        console.log(`Score submitted: ${username} scored ${score} on quiz ${quizTitle}`); // Log for debugging
    }
    catch (error) {
        console.error(
            '[ERROR: scoreRoutes.js, /submitScore] An error occurred while submitting the score.', error);
        res.status(500).json(// Return a 500 (Internal Server Error) status code with a message
            {
                success: false,
                message: 'An error occurred while submitting the score.', error: error.message
            });
    }
});

/*----------PUT----------------
PUT - UPDATE :Full replacement update of a resource on the database 
-------------------------------------*/
// -------Route 5: PUT /updateScore/:id-------
// Updates an existing score record identified by its MongoDB _id.
// Only updates if the new score is strictly higher than the stored score —
// this enforces a "personal best" model where scores can only improve.
// Also increments the attempts counter each time an update is made.
// Requires a valid JWT token (checkJwtToken middleware).
// Example: PUT /updateScore/64abc123... with body { score: 10 }
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;   // MongoDB _id of the score document to update
        const { score } = req.body;  // The new score value submitted by the client

        // Conditional rendering to ensure that the id is a properly formatted MongoDB ObjectId
        // (prevents a CastError from Mongoose if a malformed id reaches the DB query)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error(`[scoreRoutes.js, /updateScore/:id] Invalid score ID format: ${id}`);//Log an error message in the console for debugging purposes    
            return res.status(400).json({// Send a 400 (Bad Request) status code with a message
                 success: false, 
                 message: 'Invalid score ID format.' 
                });
        }

        // Conditional rendering to ensure the new score is a number and not be negative
        if (typeof score !== 'number' || score < 0) {
            console.error(`[scoreRoutes.js, /updateScore/:id] Invalid score value: ${score}. Score must be a non-negative number.`);//Log an error message in the console for debugging purposes    
            return res.status(400).json({ success: false, message: 'Invalid score value. Score must be a non-negative number.' });
        }

        // Fetch the current score document to compare against the new value
        const existingScore = await Score.findById(id).exec();
        if (!existingScore) {
            // Return 404 if no score document exists with the given id
            console.error(`[scoreRoutes.js, /updateScore/:id] Score not found with ID: ${id}`);
            return res.status(404).json({ success: false, message: 'Score not found.' });
        }

        // Enforce personal best logic: only update if the new score is strictly higher
        // Returns early without modifying the document if the new score is equal or lower
        if (existingScore.score >= score) {
            console.log(`[scoreRoutes.js, /updateScore/:id] Existing score (${existingScore.score}) is higher than or equal to new score (${score}). No update performed.`);
            return res.status(200).json({ success: false, message: 'New score is not higher than the existing score' });
        }

        // Update the score and increment the attempts counter in a single atomic operation.
        // { new: true } returns the updated document rather than the original.
        const editedScore = await Score.findByIdAndUpdate(
            id,                              // Target document by its _id
            { score, $inc: { attempts: 1 } },// Set new score and increment attempts by 1
            { new: true }                    // Return the updated document in the response
        );

        console.log(`[scoreRoutes.js, /updateScore/:id] Updated score for user ${existingScore.username} on quiz ${existingScore.quizId}`);
        return res.status(200).json(editedScore); // Respond with the updated score document
    } catch (error) {
        console.error(//Log an error message in the console for debugging purposes    
            '[ERROR: scoreRoutes.js, /updateScore/:id] An error occurred while updating the score.', error);
        res.status(500).json({ // Return a 500 (Internal Server Error) status code with a message
            success: false, 
            message: 'An error occurred while updating the score.', error: error.message 
        });
    }
})

// Export the router to be used in other parts of the application
module.exports = router;