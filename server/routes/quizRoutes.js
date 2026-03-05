// quizRoutes.js
// Import necessary modules and packages
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// Import schemas
const Quiz = require('../models/quizSchema'); // Import the Quiz model
const Score = require('../models/scoreSchema'); //Import the Score model
//Custom middleware
const {checkJwtToken} = require('./middleware')

//=============ROUTES===============
//-------GET---------------
// Route to get all quizzes
// Send a GET request to /findQuizzes to retrieve all quizzes from the database
router.get('/findQuizzes', checkJwtToken, async (req, res) => {
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
router.put('/editQuiz/:id', async (req, res) => {
        console.log(req.body);//Log the request body in the console for debugging purposes

    try {
         const { id } = req.params; // Extract quiz Id from the request parameters
        const { title, description, username, questions } = req.body;// Extract title, description, username, and questions from the request body

        //Conditional rendering to check if the quizId is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
            }

        const quiz = await Quiz.findById(id);// Find the quiz by ID
        console.log(quiz);//Log the quiz in the console for debugging purposes

        //Conditional rendering to check that the quiz exists
        if (!quiz) {
            console.error('Quiz not found');//Log an error message in the console for debugging purposes
            return res.status(404).json({ success: false, message: 'Quiz not found' });// If the quiz doesn't exist, return a 404(Not found)response
        }

        // Conditional rendering to ensure the user editing the quiz is the one who created it
        if (quiz.username !== username) {
            console.error('[ERROR: quizRoutes.js, /editQuiz/:id] Unauthorized edit attempt by:', username);
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this quiz.' });
        }

        const updatedQuiz = {}//Create the updated quiz object

        //Conditional rendering to check if the title is provided
        if (title) {updatedQuiz.title = title} // Only update the title if provided

        //Conditional rendering to check if the description is provided
        if (description) {updatedQuiz.description = description} // Only update the description if provided

         // Conditional rendering to check that the questions are properly provided
        if (questions && Array.isArray(questions) && questions.length === 5) {
            updatedQuiz.questions = questions
        } else {
            console.error('[ERROR: quizRoutes.js, /editQuiz/:id] Invalid questions provided:', questions);
            return res.status(400).json({success: false, message: 'Invalid questions provided. Questions must be an array of 5 questions.'});
        }

        //Conditional rendering to check if the quizTitle was changed
        if(title && title !== quiz.title){
            //Update the quizTitle in the Score collection if the quizTitle is updated
            await Score.updateMany(
                {quizTitle: quiz.title.toUpperCase()},//The existing quiz title
                {$set: {quizTitle: title}}//Set the new quiz title
            )
        }
        // Update the quiz in the database
        const editedQuiz = await Quiz.findByIdAndUpdate(//Find the quiz by its ID and update it
           id, // ID of the quiz to update
            { $set : updatedQuiz},//Set the updated quiz
            { new: true}// Return the updated document
        );

        console.log("[SUCCESS: quizRoutes.js, '/editQuiz/:id'] QUIZ: ", updatedQuiz);

        // Respond with the updated quiz
         res.status(200).json({ success: true, editedQuiz});
        console.log(editedQuiz);//Log the updated quiz in the console for debugging purposes

    } catch (error) {
        console.error('[ERROR: quizRoutes.js, /editQuiz/:id] Failed to update quiz:', error);
        res.status(500).json({success: false, message: 'Failed to update quiz.'});
    }
});
//--------PATCH------------
// Route to partially update an existing quiz by its ID
router.patch('/updateQuiz/:id', async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes  
    try {
        const { id } = req.params; // Extract quiz Id from the request parameters
        const { title, description, username, questions } = req.body;// Extract title, description, username, and questions from the request body   
        //Conditional rendering to check if the quizId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
        }   
        const quiz = await Quiz.findById(id);// Find the quiz by ID
        console.log(quiz);//Log the quiz in the console for debugging purposes
        //Conditional rendering to check that the quiz exists
        if (!quiz) {
            console.error('Quiz not found');//Log an error message in the console for debugging purposes
            return res.status(404).json({ success: false, message: 'Quiz not found' });// If the quiz doesn't exist, return a 404(Not found)response
        }
        // Conditional rendering to ensure the user editing the quiz is the one who created it
        if (quiz.username !== username) {
            console.error('[ERROR: quizRoutes.js, /updateQuiz/:id] Unauthorized update attempt by:', username);
            return res.status(403).json({ success: false, message: 'You are not authorized to update this quiz.' });
        }
        const updatedQuiz = {}//Create the updated quiz object
        //Conditional rendering to check if the title is provided
        if (title) {updatedQuiz.title = title} // Only update the title if provided
        //Conditional rendering to check if the description is provided
        if (description) {updatedQuiz.description = description}


            // Conditional rendering to check that the questions are properly provided
        if (questions && Array.isArray(questions) && questions.length === 5) {
            updatedQuiz.questions = questions
        } else {
            console.error('[ERROR: quizRoutes.js, /updateQuiz/:id] Invalid questions provided:', questions);
            return res.status(400).json({success: false, message: 'Invalid questions provided. Questions must be an array of 5 questions.'});
        }   
        //Conditional rendering to check if the quizTitle was changed
        if(title && title !== quiz.title){
            //Update the quizTitle in the Score collection if the quizTitle is updated
            await Score.updateMany(
                {quizTitle: quiz.title.toUpperCase()},//The existing quiz title
                {$set: {quizTitle: title}}//Set the new quiz title
            )
        }
        // Update the quiz in the database
        const editedQuiz = await Quiz.findByIdAndUpdate(//Find the quiz by its ID and update it
              id, // ID of the quiz to update
            { $set : updatedQuiz},//Set the updated quiz
            { new: true}// Return the updated document
        );
        console.log("[SUCCESS: quizRoutes.js, '/updateQuiz/:id'] QUIZ: ", updatedQuiz);
        // Respond with the updated quiz
            res.status(200).json({ success: true, editedQuiz});
        console.log(editedQuiz);//Log the updated quiz in the console for debugging purposes
    } catch (error) {
        console.error('[ERROR: quizRoutes.js, /updateQuiz/:id] Failed to update quiz:', error);
        res.status(500).json({success: false, message: 'Failed to update quiz.'});
    }
});
//--------DELETE------------
// Route to delete a quiz by its ID
router.delete('/deleteQuiz/:id' , checkJwtToken,  async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    try {
        const quiz = await Quiz.findById(id)// Find the quiz by its ID to check if the quiz exists
        //Conditional rendering to check if the quiz exists
        if (!quiz) {
           console.error('[ERROR: quizRoutes.js, /deleteQuiz/:id] Quiz not found');//Log an error message in the console for debugging purposes
            return res.status(404).json( // If the quiz is not found, respond with a 404 Not Found status and an error message
                {success: false, message: 'Quiz not found' }
            );
        }     

        const deletedQuiz = await Quiz.findByIdAndDelete(id);// Find the quiz by its ID and delete it from the database

        console.log('[SUCCESS: quizRoutes.js, /deleteQuiz/:id] Deleted Quiz:', deletedQuiz);// Log the deleted quiz in the console for debugging purposes
        res.status(200).json({ success: true, message: 'Quiz successfully deleted' });//Return a 200 OK status with a JSON object containing a success message
    } 
    catch (error) {
        //Error handling
        console.error('[ERROR: quizRoutes.js, /deleteQuiz/:id] Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Respond with a 500 (Internal Server Error) status
    }
});

//========EXPORT THE ROUTER============
module.exports = router;