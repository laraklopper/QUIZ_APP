// userSchema.js
const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'username is required'],
        minlength: [2, 'Username must be at least 2 characters long'],
        maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    //=================NESTED FULL NAME FIELD===============================
    fullName: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'First name must be at least 2 characters long'],
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters long'], 
            maxlength: [50, 'Last name cannot exceed 50 characters'],

        },
    },
    // Field for user Email
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,// Ensures no duplicate emails in the database
        // Automatically converts the email to lowercase before saving
        set: (v) => v.toLowerCase(),
        validate: {
            validator: (v) => emailRegex(v),
            message: (props) => `${props.value} is not a valid email adderss`
        },
        
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v.getTime()) && v < new Date();
            },
            message: 'Date of birth must be in the past'
        }
    },
    //Optional field for admin status
    //Admin users must be older than 18 years
    admin:{
        type: Boolean,
        default: false,
        required: false
    },
    // Field for password(hash in registration route)
    password: {
        type: String,
        required: [true, 'user password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [1024, 'Password cannot exceed 1024 characters'],
        select: false
    }
},{
    timestamps: true,
    toJSON: {virtuaSls : true},
    toObject: {virtuals: true}
})

// =================VIRTUALS================

