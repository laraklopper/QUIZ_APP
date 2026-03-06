// quizSchema
const mongoose = require('mongoose');

// Define the quiz schema with fields for title, description, username, and an array of questions
// Each question is an object containing the question text, correct answer, and an array of options
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
        minlength: [2, 'Quiz title must be at least 2 characters long'],
        maxlength: [100, 'Quiz title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Quiz description cannot exceed 500 characters'],
        required: [true, 'Quiz description is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    //Field for questions containing an array of objects(subdocuments)
    questions: {
        type:[
            {
                //Field for question text, with validation to ensure it's not empty and has a minimum length
                questionText: {
                    type: String,
                    required: [true, 'Question text is required'],
                    trim: true,
                    set: (v) => v.toUpperCase(), // Convert question text to uppercase
                    minlength: [5, 'Question text must be at least 5 characters long'],
                },
                //Specify the correct answer as a string, which will be compared to the user's answer
                correctAnswer: {
                    type: String,
                    required: [true, 'Correct answer is required'],
                    trim: true,
                    set: (v) => v.toUpperCase(), // Convert correct answer to uppercase
                },
                //Array of options for each question, with custom validation to ensure exactly 3 options
                options: {
                    type: [String],
                    required: [true, 'Options are required'],
                    validate: [arrayLimit, 'Each question must have exactly 3 options'],
                    set: (v) => v.map((option) => option.toUpperCase()), // Convert all options to uppercase
                    trim: true,
                }
            }
        ],
         required: [true, 'Quiz questions are required'],
         validate: [arrayLimit5, 'Quiz must have at least 5 questions'],
    },
}, {timestamps: true});

/* Custom validation function to ensure each 
question has exactly 3 options*/
function arrayLimit(val) {
    return val.length === 3; 
}

/* Custom validation function to ensure 
each quiz has exactly 5 questions*/
function arrayLimit5(val) {
    return val.length === 5;
}

module.exports = mongoose.model('Quiz', quizSchema);