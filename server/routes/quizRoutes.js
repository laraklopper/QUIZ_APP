// quizRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Assuming you have a Quiz model defined in models/Quiz.js
//=============ROUTES===============
//-------GET---------------
// Route to get all quizzes
// Send a GET request to /findQuizzes to retrieve all quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json({success: true, quizList: quizzes});

        console.log(`[DATA RETRIEVED: quizRoutes.js, '/findQuizzes'] ${quizzes.length} quizzes found.`);
        
    } catch (error) {
        console.error('[ERROR: quizRoutes.js, /findQuizzes] Failed to retrieve quizzes:', error);
        res.status(500).json({success: false, message: 'Failed to retrieve quizzes.'});
    }
})
//Route to get a specific quiz by its ID
//send a GET request to /findQuiz/:id to retrieve a quiz by its ID from the database
router.get('/findQuiz/:id', async (req, res) => {
    try {
        const {id} = req.params;

        //Conditional rendering to check if the quiz id exists in the database
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            console.error('[ERROR: quizRoutes.js, /findQuiz/:id] Invalid quiz ID provided:', id);
            
            return res.status(400).json({success: false, message: 'Invalid quiz ID.'});
        }
        const quiz = await Quiz.findById(id);//find the quiz by its ID in the database and populate the userId field with the 'username'
        if (!quiz) {
            console.error('[ERROR: quizRoutes.js, /findQuiz/:id] Quiz not found:', id);
            return res.status(404).json({success: false, message: 'Quiz not found.'});
        }
        res.status(200).json({success: true, quiz: quiz});
        console.log(`[SUCCESS: quizRoutes.js, /findQuiz/:id] Quiz found: ${quiz}`);
        
    } catch (error) {
        console.error('[ERROR: quizRoutes.js, /findQuiz/:id] Failed to retrieve quiz:', error);
        res.status(500).json({success: false, message: 'Failed to retrieve quiz.'});
    }
})
//-------POST--------------
// Route to create a new quiz

//--------PUT---------------
// Route to update an existing quiz by its ID

//--------PATCH------------
// Route to partially update an existing quiz by its ID
//--------DELETE------------
// Route to delete a quiz by its ID

//========EXPORT THE ROUTER============
module.exports = router;