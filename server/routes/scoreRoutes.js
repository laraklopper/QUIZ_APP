// scoreRoute.js
const express = require('express');
const router = express.Router();
const Score = require('../models/Score'); // Assuming you have a Score model defined in models/Score.js 


//===========ROUTES===============
//-----------GET----------------
// Route to get all quiz scores//
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

        res.status(200).json()


    } catch (error) {
        
    }
})
//-----------POST---------------
//----------PUT----------------
//-----------DELETE----------------

module.exports = router;