//StartQuiz.js
// Import necessary modules and packages
import React from 'react'
// CSS Stylesheets
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
// Bootstrap
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// Import Icons from Lucide-React
import { Hourglass } from 'lucide-react';

//StartQuizForm function component
export default function StartQuizForm(//Export the default StartQuizForm function component
  {//PROPS PASSED FROM PARENT COMPONENT (QuizDisplay.js)
    quiz, 
    quizTimer, 
    setQuizTimer, 
    quizStarted, 
    handleQuizStart}) {

      //===============JSX RENDERING=================

  return (
    <form 
      onSubmit={handleQuizStart} 
      id='startQuizForm' 
      aria-labelledby='startQuizHeading'
      method='put'
      >
    {/* -----------SCREEN READER HEADING------------- */}
    <p className='visually-hidden' id='startQuizHeading'>START QUIZ FORM</p>
    {/* ----------FORM INPUT------------ */}
         <Stack gap={3} id='startQuizStack' aria-live='polite'>
           <div className="p-2" id='selectedQuizNameBlock'>   
           {/* SELECTED QUIZ NAME */}
             <h3 className='quizTitle'>{quiz ? quiz.title : ''}</h3>
             {/* If the quiz does not exist display an empty string */}
            </div>                    
                 <div id='addTimerBlock'>
                      <label id='addTimerLabel' htmlFor='addQuizTimer'>
                        <p className='labelText'>ADD TIMER:</p>
                      </label>
                  {/* Checkbox to add timer based on the quizTimer state */}
                  <input
                      type='checkbox'
                      checked={quizTimer}//Current state of the timer 
                      // Update the timer state when toggled
                      onChange={(e) => setQuizTimer(e.target.checked)}
                      id='addQuizTimer'
                      // Disable checkbox if the quiz has started
                      disabled={quizStarted} 
                      aria-label='Add timer checkbox'
                  />
                  <Hourglass aria-hidden='true' fill='#eadd61'/>
          </div>
          <div className="p-2" id='startQuizBtnBlock'>
          {/* Button to start quiz */}
            <Button 
            type='submit' 
            variant='light' 
            id='startQuizBtn' 
            aria-label='button to start quiz'
            >
              START QUIZ
            </Button>
          </div>
         </Stack>
    </form>
  )
}
