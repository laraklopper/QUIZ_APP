// Results.js
import React, { useCallback, useState } from 'react'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
import { currentDate } from '../utilFunctions/dateFunctions';

export default function Results(
  {
    currentScore,
    quizName,
    totalQuestions,
    currentUser,
    addScore
  }) {
    const [showScore, setShowScore] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [submissionError, setSubmissionError] = useState(null);

    const handleSubmitScore = useCallback(async (e) => {
      e.preventDefault()
      setSubmitted(true)
      setSubmissionError(null)
      try {
        await addScore()
        console.log(currentScore);
        setShowScore(false)
      } catch (error) {
        setSubmissionError('Failed to save score');
        console.error('[ERROR: Results.js, handleSubmitScore]: Failed to save score', error.message);
      }finally{
        setSubmitted(false);
      }
    },[addScore, currentScore])
    //=================================

  return (
    showScore && (
      <div id='results'>
      <form onSubmit={handleSubmitScore} id='quizResultsForm'>
      {/* -------------SCREEN READER HEADING------------------ */}
          <div>
            <Stack gap={3}>
            {/* QUIZ NAME */}
      <div className="p-2" id='quizNameBlock'>
        <input
          value={quizName || 'UNNAMED QUIZ'}
          readOnly
          type='text'
          className='input'
          aria-readonly='true'

        />
        {/* USERNAME */}
         <input
        id='quizUser'
        className='input'
        type='text'
        value={`USERNAME: ${currentUser?.username || ''}`}
        readOnly
        aria-readonly='true'/>
      </div>
      
      {/* SCORE AND TOTAL QUESTIONS */}
      <div className="p-2">
        {/* Display the result with the score and total questions */}
              <input
                id='resultOutput'
                className='resultFormInput'
                type='text'
                value={`RESULT: ${currentScore} OF ${totalQuestions}`} // Display score and total questions
                readOnly
              />
              <input
                type='text'
                value={currentDate()}// Display the current date
                name='date'
                readOnly
                className='input'
                aria-readonly='true'
              />
      </div>
      {/* BUTTON */}
      <div className="p-2">
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
        {submissionError && <p>{submissionError}</p>}
      </form>

      </div>
    )
  )
}
