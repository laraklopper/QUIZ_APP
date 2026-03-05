// scoreRoute.js
const express = require('express');// Import express to create a router for handling quiz score-related routes
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId formats
//Import the necessary models and middleware to handle quiz scores and user authentication
const Score = require('../models/Score'); // Import the Score model to interact with the scores collection in the database
const Quiz = require('../models/Quiz'); // Import the Quiz model to check for existing quizzes when fetching scores
const User = require('../models/User'); // Import the User model to check for existing users when fetching scores
//Import custom middleware
const {checkJwtToken} = require('./middleware'); // Import the checkJwtToken middleware 
//Ceate a new router instance to define the routes for handling quiz scores
const router = express.Router();// Create a new router instance to define the routes for handling quiz scores

//===========ROUTES===============
//-----------GET----------------
// Route to get all quiz scores//
// Send a GET request to /fetchScores endpoint with an optional username query parameter to fetch all scores or scores for a specific user
router.get('/fetchScores', async (req, res) => {
    try {
        const {username} = req.query;

        //Conditional rendering to check if the username is a string
        if (username && typeof username !== 'string') {
            console.error('[scoreRoutes.js:] Invalid username format. Username must be a string.');
            return res.status(400).json({ success: false, message: 'Invalid username format. Username must be a string.' });
        }

         // Fetch all quiz tiles from the database to check for existing quizzes
         let quizTitles = await Quiz.find().select('title').exec();
         let existingTitles = quizTitles.map(quiz => quiz.title);
         // Fetch all usernames from the database to check for existing users
         let userNames = await User.find().select('username').exec();
         let existingUsernames = userNames.map(user => user.username);

         /* Remove any Score documents where the quiz title or
          username no longer exists in the Quiz or User collection*/
          await Score.deleteMany({
            $or: [
                { quizTitle: { $nin: existingTitles } },
                { username: { $nin: existingUsernames } }
            ]
        });

        console.log(existingTitles);//Log the existing quiz names in the console for debugging purposes
        console.log(existingUsernames);//Log the existing usernames in the console for debugging purposes

          // Declare a variable to store the quiz scores
          let quizScores;

          // Conditional rendering to check if a username is provided
            if (username) {
                quizScores = await Score.find({ username }).exec(); // Fetch scores for the specified username
            } else {
                quizScores = await Score.find(req.body).exec(); // Fetch all scores if no username is provided
            }

          //Log the fetched scores in the console for debugging puroses
          console.log(quizScores);
          // Return the fetched user scores in JSON format  
          return res.status(200).json({ success: true, scores: quizScores });
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js:] An error occurred while fetching scores.', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching scores.', error: error.message });
    }
});

// Route to fetch all scores for a single user
//send a GET request to /findScores/:username endpoint with the username as a parameter to fetch all scores for that user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params;// Extract the username from the request parameters

        //Conditional rendering to check if the username field exists and is a string
        if (!username || typeof username !== 'string') {
            console.error('[scoreRoutes.js, /findScores/:username] Invalid username format. Username must be a string.');
            return res.status(400).json({ success: false, message: 'Invalid username format. Username must be a string.' });
        }
        // Fetch the user document based on the username
        const user = await User.findOne({ username }).exec();

        // Conditional rendering to check if the user exists
        if (!user) {
            console.error(`[scoreRoutes.js, /findScores/:username] User not found: ${username}`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username })
            .populate('title')// Populate the quiz title reference if it's a relationship
            .sort({createdAt: -1 })// Sort the scores by creation date (most recent first)
            .exec();// Execute the query

        res.status(200).json({userScores: result});
        console.log(result);//Log the results in the console for debugging purposes
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js, /findScores/:username] An error occurred while fetching user scores.', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching user scores.', error: error.message });
    }
})

//Route to fetch a single score for a specific quiz and user
//Send a GET request to /findScore/:username/:quizTitle endpoint with the username and quiz title as parameters to fetch the score for that specific quiz and user
//Find userScore for a specific quiz
router.get('/findScore/:username/:quizTitle', async (req, res) => {
    try {
        const { username, quizTitle } = req.params;// Extract the username and quiz title from the request parameters   
        // Fetch the score for the specified quiz and user
        const result = await Score.findOne({ username, quizTitle }).exec();

        // Conditional rendering to check if the score exists
        if (!result) {
            console.error(`[scoreRoutes.js, /findScore/:username/:quizTitle] Score not found for user ${username} and quiz ${quizTitle}`);
            return res.status(404).json({ success: false, message: 'Score not found for this user and quiz.' });
        }
        res.status(200).json({ userScore: result });
        console.log(result);//Log the result in the console for debugging purposes
    } catch (error) {
        console.error('[ERROR: scoreRoutes.js, /findScore/:username/:quizTitle] An error occurred while fetching the user score for the specified quiz.', error);
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

        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({message: 'Score must be a integer'})
        }

        // Check if the quiz exists
        const quiz = await Quiz.findOne({ title: quizTitle }).exec();
        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            console.error(`[scoreRoutes.js, /submitScore] Quiz not found: ${quizTitle}`);
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        //Check if a score already exists for the quiz    
        const existingScore = await Score.findOne({ username, quizId: quiz._id }).exec();

        // Conditional rendering to Check if a score already exists for the user and the quiz
        if (existingScore) {
            console.error(`[scoreRoutes.js, /submitScore] Score already exists for user ${username} and quiz ${quizTitle}`);
            return res.status(400).json({ success: false, message: 'Score already exists for this user and quiz.' });
        }else {
            // If no existing score, create a new score document
            // If a score exists, update it; otherwise, create a new score        
            const newScore = existingScore
                ? await Score.findByIdAndUpdate(
                    existingScore._id,// Use the ID of the existing score
                    { score, $inc: { attempts: 1 } },// Increment attempts
                    { new: true }// Return the updated score
                )
                : await new Score({ username, name, score }).save();// Create a new score
            res.status(201).json(newScore)// Save the score and return the result in JSON format
        }
       
    //Log the score in the console for debugging purposes
        console.log(`Score submitted: ${username} scored ${score} on quiz ${quizTitle}`);
    }
    catch (error) {
        console.error('[ERROR: scoreRoutes.js, /submitScore] An error occurred while submitting the score.', error);
        res.status(500).json({ success: false, message: 'An error occurred while submitting the score.', error: error.message });
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
                console.error(`[scoreRoutes.js, /updateScore/:id] Invalid score ID format: ${id}`);
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
        console.error('[ERROR: scoreRoutes.js, /updateScore/:id] An error occurred while updating the score.', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the score.', error: error.message });
    }
})

// Export the router to be used in other parts of the application
module.exports = router;