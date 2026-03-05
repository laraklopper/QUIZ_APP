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
router.post('/createQuiz', async (req, res) => {
    console.log(req.body);// Log the request body to verify that the data is being received correctly from the client before processing it to create a new quiz in the database
    try {
        const {title, description, username, questions} = req.body;//Extract the title, description, username, and questions from the request body

        //Conditional rendering to check if all required fields are present in the request body
        if (!title || !description || !username || !questions) {
            console.error('[ERROR: quizRoutes.js, /createQuiz] Missing required fields in request body:', req.body);
            return res.status(400).json({success: false, message: 'Missing required fields: title, description, username, and questions are all required.'});
        }

        // Check if a quiz with the same title already exists in the database to prevent duplicate quiz titles
        const existingQuiz = await Quiz.findOne({title: title.trim()});
        // Conditional rendering to check if a quiz with the same title already exists in the database to prevent duplicate quiz titles
        if (existingQuiz) {
            console.error('[ERROR: quizRoutes.js, /createQuiz] Quiz with the same title already exists:', title);
            return res.status(409).json({success: false, message: 'A quiz with the same title already exists. Please choose a different title.'});
        }

        // Create a new quiz document using the Quiz model
        const newQuiz = new Quiz({
            title,
            description,
            username,
            questions
        });
        const savedQuiz = await newQuiz.save();
        res.status(201).json({success: true, quiz: savedQuiz});
        console.log(`[SUCCESS: quizRoutes.js, /createQuiz] Quiz created successfully: ${savedQuiz}`);
    } catch (error) {
        console.error('[ERROR: quizRoutes.js, /createQuiz] Failed to create quiz:', error);
        res.status(500).json({success: false, message: 'Failed to create quiz.'});
    }    
});
//--------PUT---------------
// Route to update an existing quiz by its ID

//--------PATCH------------
// Route to partially update an existing quiz by its ID
//--------DELETE------------
// Route to delete a quiz by its ID

//========EXPORT THE ROUTER============
module.exports = router;