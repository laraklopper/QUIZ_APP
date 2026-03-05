//scoreSchema.js    
const mongoose = require('mongoose');


// Define the score schema
const scoreSchema = new mongoose.Schema({
    // Field for the title of the quiz taken
    quizTitle: {
        type: String,
        required: [true, 'Quiz title is required'],
        set: (v) => v.toUpperCase(), // Convert quiz title to uppercase
        trim: true
    },  
     //Field for the quiz ID, which is a reference to the Quiz model and is required
    // quizId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: [true, 'Quiz ID is required'],
    //     ref: 'Quiz'
    // },
    //Field for username, which is required and will be trimmed of whitespace
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    //Field for the user ID, which is a reference to the User model and is required
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: [true, 'User ID is required'],
    //     ref: 'User'
    // },
    //Field for the user's score on the quiz, which must be an integer between 0 and 5
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score cannot be negative'],
        max: [5, 'Score cannot exceed 5'],
        set: (v) => Math.floor(v), // Ensure score is an integer
        validate: {
            validator: Number.isInteger,
            message: 'Score must be an integer between 0 and 5'
        }
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,
        default: 1,// Set the default value to 1 for the first attempt
        set: (v) => Math.floor(v), // Ensure attempts is an integer
        required: [true, 'Attempts are required'],
        min: [0, 'Attempts cannot be negative']
    },
     //Field for the date of the current attempt
    attemptDate: {
        type: Date,
        required: [true, 'Attempt date is required'],
        default: Date.now
    }
}, {timestamps: true});

// Export the Score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);