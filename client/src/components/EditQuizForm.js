// EditQuizForm.js
/*EditQuizForm component: Displays a form that allows admin users to edit an existing
quiz, including its name, description, and individual questions with navigation between them.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css';
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT ICONS FROM LUCIDE-REACT
import { ArrowBigLeftDash, ArrowBigRightDash, FileQuestionMark } from 'lucide-react';

// EditQuizForm function component
export default function EditQuizForm(//Export default EditQuizForm function component
    {//PROPS PASSED FROM PARENT COMPONENT (AddQuiz.js)
        editQuiz,      // Function to submit the updated quiz to the server
        error,         // Global error message string
        currentUser,   // Object containing the currently logged-in user's details
        quizName,      // String storing the name of the quiz being edited
        setQuizName,   // Function to update the quiz name state
        description,   // String storing the quiz description being edited
        setDescription,// Function to update the quiz description state
        questions,     // Array of question objects for the quiz being edited
        setQuestions,  // Function to update the questions array state
        editQuizId,    // ID of the quiz currently being edited
}) {
    // ==========STATE VARIABLES============
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)// State to track which question is currently displayed in the form
    const [loadingEdit, setLoadingEdit] = useState(false)// State to indicate if the edit request is in progress

    //============EVENT LISTENERS=================
    // Function to handle the form submission for editing a quiz
    const handleEdit = async (e) => {
        e.preventDefault()// Prevent the default form submission behaviour
        const confirmEdit = window.confirm('Are you sure you want to edit this quiz?')// Prompt the user to confirm before editing
        if (!confirmEdit) return;// Exit if the user cancels
        setLoadingEdit(true)// Set loading state while request is in progress
        try {
            await editQuiz()// Call the editQuiz function passed down from AddQuiz.js
        } finally {
            setLoadingEdit(false)// Always reset loading state after the request completes
        }
    }

    // Derive the current question object from the questions array using the current index
    const currentQuestion = questions[currentQuestionIndex]

    // Function to update a single field of the currently displayed question
    const updateCurrentQuestion = (field, value) => {
        setQuestions(questions.map((q, i) =>
            i === currentQuestionIndex ? { ...q, [field]: value } : q// Replace only the question at the current index
        ))
    }

    // Function to update a single alternative answer option of the currently displayed question
    const updateOption = (optIndex, value) => {
        setQuestions(questions.map((q, i) => {
            if (i !== currentQuestionIndex) return q// Leave other questions unchanged
            const options = [...q.options]// Copy the options array to avoid direct mutation
            options[optIndex] = value// Update the option at the given index
            return { ...q, options }// Return the updated question
        }))
    }

    // If no quiz is selected for editing, render nothing
    if (!editQuizId) return null

    return (
        <form id='editQuizForm' onSubmit={handleEdit} aria-labelledby='editQuizData'
            aria-busy={loadingEdit}
            method='PATCH'
        >
            {/* -----Screen Reader Heading-------- */}
            <p className='visually-hidden' id='editQuizData'>EDIT QUIZ FORM</p>
            {/* -----STACK 1: Form Heading + success/error messages CreatedBy */}
            <Stack gap={3} id='editQuizStack1'>
                <div className="p-2" id='editQuizFormHeading'>
                    <h3 className='formHeading'>EDIT QUIZ</h3>
                </div>
                <div id='editQuizStatus' aria-live='polite' aria-atomic='true'>
                    {error && <div className='error-message' role='alert'>{error}</div>}
                </div>
                {/* Display the full name of the user who created the quiz */}
                <div id='editCreatedByBlock' aria-label='Quiz creator'>
                    <h6 className='formText'>CREATED BY: {currentUser?.fullName?.firstName} {currentUser?.fullName?.lastName}</h6>
                </div>
            </Stack>
            <div id='editQuizDetails'>
                <Stack gap={3} id='editQuizStack2'>
                    {/*--------- QUIZ NAME---------------- */}
                    <div className="p-2" id='editQuizNameBlock'>
                        <label className='editQuizLabel' htmlFor='editQuizNameInput'>
                            <p className='labelText'>QUIZ NAME:</p>
                        </label>
                        <input
                            className='editQuizInput'
                            type='text'
                            id='editQuizNameInput'
                            name='quizName'
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            autoComplete='off'
                            aria-label='Edit quiz name'
                            aria-required='true'
                            disabled={loadingEdit}
                        />
                    </div>
                    {/* --------QUIZ DESCRIPTION ------------*/}
                    <div className="p-2" id='editQuizDescriptionBlock'>
                        <label htmlFor='editQuizDescriptionInput'>
                            <p className='labelText'>QUIZ DESCRIPTION:</p>
                        </label>
                        <input
                            className='editQuizInput'
                            type='text'
                            id='editQuizDescriptionInput'
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoComplete='off'
                            // ARIA 
                            aria-label='Edit quiz description'
                            disabled={loadingEdit}
                        />
                    </div>
                    {/*-------- QUESTIONS ----------------- */}
                    <div id='editQuestions' aria-labelledby='editQuizQuestions'>
                    {/* -------Screen Reader Heading */}
                    <p className='visually-hidden' id='editQuizQuestions'>EDIT QUIZ QUESTIONS</p>
                     <h4 className='formSectionHeading'><FileQuestionMark aria-hidden='true'/>QUESTIONS</h4>
                    {/* Only render the question editor if questions exist and a current question is available */}
                    {questions.length > 0 && currentQuestion && (
                        <div
                            id='editQuestionsBlock'
                            role='group'
                            aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                        >
                            <p className='labelText' aria-hidden='true'>
                                QUESTION {currentQuestionIndex + 1} OF {questions.length}:
                            </p>
                            {/* --------NAVIGATION BUTTONS--------- */}
                            <div id='editQuizNavBtns' role='navigation' aria-label='Question navigation'>
                            {/* Previous Question button */}
                                <Button
                                    size='sm'
                                    type='button'
                                    onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    aria-label='Previous question'
                                >
                                    <ArrowBigLeftDash fontWeight={700} color='#000' aria-hidden='true' />
                                </Button>
                                {/* Next Question button */}
                                <Button
                                    size='sm'
                                    type='button'
                                    onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    aria-label='Next question'
                                >
                                    <ArrowBigRightDash fontWeight={700} color='#000' aria-hidden='true' />
                                </Button>
                            </div>
                            <Stack gap={2} id='editQuestionsStack'>
                                <div className='editQuestion'>
                                    <label htmlFor='editQuestionText'>
                                        <p className='labelText'>QUESTION:</p>
                                    </label>
                                    <input
                                        className='editQuizInput'
                                        type='text'
                                        id='editQuestionText'
                                        value={currentQuestion.questionText}
                                        onChange={(e) => updateCurrentQuestion('questionText', e.target.value)}
                                        autoComplete='off'
                                        aria-label='Edit question text'
                                        aria-required='true'
                                        disabled={loadingEdit}
                                    />
                                </div>
                                <div className='editQuesCorrectAnswer'>
                                    <label htmlFor='editCorrectAnswer'>
                                        <p className='labelText'>CORRECT ANSWER:</p>
                                    </label>
                                    <input
                                        className='input'
                                        type='text'
                                        id='editCorrectAnswer'
                                        value={currentQuestion.correctAnswer}
                                        onChange={(e) => updateCurrentQuestion('correctAnswer', e.target.value)}
                                        autoComplete='off'
                                        aria-label='Edit correct answer'
                                        aria-required='true'
                                        disabled={loadingEdit}
                                    />
                                </div>
                                {/* Map over the options array to render an input for each alternative answer */}
                                {currentQuestion.options.map((opt, i) => (
                                    <div key={i} id='editAltOptions'>
                                        <label htmlFor={`editOption${i}`}>
                                            <p className='labelText'>{i + 1}. ALTERNATIVE ANSWER:</p>
                                        </label>
                                        <input
                                            className='input'
                                            type='text'
                                            id={`editOption${i}`}
                                            value={opt}
                                            onChange={(e) => updateOption(i, e.target.value)}// Update the option at index i
                                            autoComplete='off'
                                            aria-label={`Alternative answer ${i + 1}`}
                                            aria-required='true'
                                            disabled={loadingEdit}
                                        />
                                    </div>
                                ))}
                            </Stack>
                        </div>
                    )}
                    </div>
                </Stack>
            </div>
            {/* ---------STACK 3: BUTTONS: editQuizBtn + clearFormBtn ----------------- */}
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack3' role='toolbar' aria-label='Form actions'>
            {/* Edit quiz submit */}
                <Button
                    variant="light"
                    type='submit'
                    id='editQuizBtn'
                    disabled={loadingEdit}
                    aria-busy={loadingEdit}
                    aria-label={loadingEdit ? 'Saving quiz changes' : 'Submit edit quiz form'}
                >{loadingEdit ? 'SAVING...' : 'EDIT QUIZ'}</Button>
                {/* Clear Form Btn */}
                {/* Button to clear the quiz name and description fields */}
                <Button
                    variant="danger"
                    type='button'
                    id='clearFormBtn'
                    onClick={() => { setQuizName(''); setDescription(''); }}// Reset quiz name and description to empty strings
                    aria-label='Clear quiz name and description fields'
                    disabled={loadingEdit}
                >
                    CLEAR
                </Button>
            </Stack>
        </form>
    )
}
