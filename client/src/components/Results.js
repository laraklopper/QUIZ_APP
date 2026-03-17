// Results.js
/*Results component: Displays the user's quiz results after completion, showing the score
and total questions, with a form to save the score to the database.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/Scores.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT UTILITY FUNCTIONS
import { currentDate } from '../utilFunctions/dateFunctions';

// Results function component
export default function Results(//Export default Results function component
  {// PROPS PASSED FROM PARENT COMPONENT (QuizDisplay.js)
    currentScore,  // Number representing the user's score for the completed quiz
    quizName,      // String storing the name of the completed quiz
    totalQuestions,// Number representing the total number of questions in the quiz
    currentUser,   // Object containing the currently logged-in user's details
    addScore       // Function to save the quiz score to the server
  }) {
    //===========STATE VARIABLES=================
    const [showScore, setShowScore] = useState(true);// State to control whether the results panel is visible
    const [submitted, setSubmitted] = useState(false)// State to track whether the score submission is in progress
    const [submissionError, setSubmissionError] = useState(null);// State to store any error that occurs during score submission

    //==========EVENT LISTENERS=================
    // Function to handle the score submission form
    const handleSubmitScore = useCallback(async (e) => {
      e.preventDefault()// Prevent the default form submission behaviour
      setSubmitted(true)// Disable the submit button while the request is in progress
      setSubmissionError(null)// Clear any previous submission errors
      try {
        await addScore()// Call the addScore function passed down from QuizDisplay.js
        console.log(currentScore);//Log the current score in the console for debugging purposes
        setShowScore(false)// Hide the results panel after a successful submission
      } catch (error) {
        setSubmissionError('Failed to save score');// Display an error message in the UI
        console.error('[ERROR: Results.js, handleSubmitScore]: Failed to save score', error.message);//Log the error for debugging
      }finally{
        setSubmitted(false);// Always re-enable the submit button after the request completes
      }
    },[addScore, currentScore])

    //=============JSX RENDERING====================
// Display after the user complated the quiz
    return (
      showScore && (
        <div id='results'>
        {/* ========QUIZ RESULTS FORM================= */}
        <form onSubmit={handleSubmitScore} id='quizResultsForm' aria-labelledby='resultsHeading'>
        {/* -------------SCREEN READER HEADING------------------ */}
        <p className='visually-hidden' id='resultsHeading'>QUIZ RESULTS</p>
            <div id='quizResultDetails'>
            <div id='resultsScoreHeadingBlock'>
              <h3 className='formHeading'>{quizName}: RESULTS</h3>
            </div>
              <Stack gap={3} id='quizResultsStack'>
              {/* QUIZ NAME */}
              <div className="p-2" id='quizNameBlock' hidden>
                <input
                  value={quizName || 'UNNAMED QUIZ'}
                  readOnly
                  type='text'
                  className='input'
                  aria-readonly='true'
                  hidden
                />
                {/* USERNAME: HIDDEN: readonly */}
                <input
                id='quizUser'
                className='input'
                hidden
                type='text'
                value={`USERNAME: ${currentUser?.username || ''}`}
                readOnly
                aria-readonly='true'/>
              </div>
                {/* SCORE AND TOTAL QUESTIONS */}
              <div className="p-2" id='totalScoreBlock'>
                {/* Display the result with the score and total questions */}
                      <input
                        id='resultOutput'
                        type='text'
                        value={`RESULT: ${currentScore} OF ${totalQuestions}`}
                        readOnly
                        className='input'
                        aria-label={`Your score: ${currentScore} out of ${totalQuestions}`}
                        aria-readonly='true'
                      />
                      <input
                        type='text'
                        value={currentDate()}// Display the current date
                        name='date'
                        hidden
                        readOnly
                        className='input'
                        aria-readonly='true'
                      />
              </div>
              {/* BUTTON */}
              <div className="p-2" id='resultsFormBtnBlock'>
              <Button
              variant='light'
              type='submit'
              disabled={submitted}
              id='saveScoreBtn'
              aria-label='BUTTON TO SAVE SCORE'
              aria-disabled={submitted}>
                {/* Text bassed on the submission state */}
                  {submitted ? 'Submitting...' : 'SAVE SCORE AND EXIT'}
              </Button>
              </div>
              </Stack>
            </div>
            {/* Display error message if an error
            occurs when the score is submitted */}
          {submissionError && <p role='alert' aria-live='assertive'>{submissionError}</p>}
        </form>

        </div>
      )
    )
}