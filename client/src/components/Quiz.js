// Quiz.js
/*Quiz component: Displays the active quiz, rendering each question with multiple-choice options,
an optional countdown timer, answer feedback, current score, and navigation controls.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useEffect, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/Quiz.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT ICONS FROM LUCIDE-REACT
import { ArrowBigRightDash, RotateCcw, X ,Check, MessageCircleQuestionMark} from 'lucide-react';
// IMPORT UTILITY FUNCTIONS
import { formatTimer } from '../utilFunctions/quizFunctions';

// Quiz function component
export default function Quiz(//Export default Quiz function component
  {//PROPS PASSED FROM PARENT COMPONENT (QuizDisplay.js)
    quiz,             // Object containing the full quiz data
    quizIndex,        // Number representing the index of the currently displayed question
    setQuizIndex,     // Function to update the current question index
    setCurrentScore,  // Function to update the user's score
    currentScore,     // Number representing the user's current score
    questions,        // Array of shuffled question objects for the active quiz
    quizTimer,        // Boolean indicating whether the countdown timer is enabled
    timer,            // Number representing the timer reset value (in seconds)
    // FUNCTIONS
    handleNextQuestion,// Function to advance to the next question or end the quiz
    handleRestart      // Function to restart the quiz from the beginning
  }
) {
  //============STATE VARIABLES================
  const [selectedOption, setSelectedOption] = useState(null)// State to store the option the user has selected
  const [feedback, setFeedback] = useState('')// State to store the correct/incorrect feedback message
  const [timeLeft, setTimeLeft] = useState(10)// State to store the remaining time for the current question

  // ========USE EFFECT HOOK==================
  /* Effect to reset the question index to the first 
  question when the questions array changes */
  useEffect(() => {
    if (questions.length > 0) {
      setQuizIndex(0)
    }
  },[questions, setQuizIndex])
  
  // Effect to manage the countdown timer for each question
  useEffect(() => {
    if(!quizTimer) return;// Exit early if the timer is not enabled

    setTimeLeft(timer)// Reset the timer to the configured value for each new question
    let isMounted = true;// Track whether the component is still mounted to prevent state updates after unmount
    const interval = setInterval(() => {
      if (isMounted) {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);// Stop the interval when time runs out
            handleNextQuestion()// Automatically advance to the next question
            return 0
          }
          return prevTime - 1// Decrement the timer by 1 each second
        })
      }
    }, 1000);
    return() => {
      isMounted = false// Prevent state updates after the component unmounts
      clearInterval(interval)// Clear the interval on cleanup to prevent memory leaks
    }
  },[timer, handleNextQuestion, quizTimer])

  // Display loading text if quiz or questions are not available
  if (!quiz || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }


  // ============EVENT LISTENERS=================
  // Function to evaluate the selected answer and update the score and feedback
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setCurrentScore(currentScore + 1)// Increment the score for a correct answer
      setFeedback(<p className='correctFeedback'>CORRECT <Check fontWeight={700} aria-hidden='true'/></p>)// Show correct feedback
    } else {
      setFeedback(<p className='incorrectFeedback'>INCORRECT <X fontWeight={700} aria-hidden='true' /> </p>);// Show incorrect feedback
    }
    setTimeout(() => setFeedback(''), 1000)// Clear the feedback message after 1 second
  }

  // Function to handle when the user clicks an answer option
  const handleOptionClick = (option) => {
    setSelectedOption(option);// Store the selected option in state
    // Check if the selected option matches the correct answer and update the score
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
    handleNextQuestion();// Advance to the next question after an option is selected
  };

  //============JSX RENDERING================
  return (
    <div id='quiz' aria-labelledby='currentQuiz'>
    {/* ---------------SCREEN READER MESSAGE------------- */}
    <p className='visually-hidden' id='currentQuiz'>{quiz.name}</p>
    <Stack id='quizStack1'>
      <div id='quizNameBlock'>
      {/* Display quiz name */}
          <h3 className='quizName'>{quiz.title}</h3>
          </div>
      <div className="p-2">
         {/* Display question number */}
            <div id='questionNumber'>
              <label className='quizNumberLabel'>
                <p className='number'>
                  QUESTION {quizIndex + 1} of {quiz.questions.length}
                </p>
              </label>
            </div>
             {/* Display timer if enabled */}
            {quizTimer &&
            <div id='timer' role='timer' aria-live='polite' aria-label={`Time remaining: ${formatTimer(timeLeft)}`}>
              TIMER: {formatTimer(timeLeft)}
            </div>}
      </div>
      <div className="p-2">
           {/* Display current question text */}
              <label className='questionLabel'>
                <h6 id='questionText'>
                  {questions[quizIndex].questionText}<MessageCircleQuestionMark  aria-hidden='true'/>
                  </h6>
              </label>
      </div>
    </Stack>
    {/* ---------QUIZ OPTIONS + FEEDBACK MESSAGE + CURRENT SCORE======= */}
       <Stack  gap={3} id='quizStack2'>
        <div className="p-2" id='questionsBlock' role='group' aria-labelledby='questionText'>
           {/* Map over the options array to render a button for each answer choice */}
          {questions[quizIndex].options.map((option, index) => (
                <Button
                  key={index}
                  id='answerOption'
                  name='options'
                  checked={selectedOption === option}
                  type='button'
                  variant='success'
                  aria-describedby='questionText'
                  onClick={() => handleOptionClick(option)}// Call handleOptionClick with the selected option
                >
                  {option}
                </Button>
              ))}
              {/* Display feedback message */}
              <div id='feedbackOutput' role='status' aria-live='polite' aria-atomic='true'>
                {feedback}
              </div>
        </div>        
        <div id='currentResultBlock'>              
           {/* Display the current score */}
           <h6 id='resultText' aria-live='polite' aria-atomic='true'>RESULT: {currentScore} of {quiz.questions.length}</h6>
        </div>
       </Stack> 
         <Stack id='quizBtnStack'>
      <Button
      variant="primary"
      onClick={handleNextQuestion}
      type='button'
      size='sm'
      id='navBtn'
      aria-label={`Next question (${quizIndex + 1} of ${quiz.questions.length})`}
      aria-describedby='questionNumber'
      >
        NEXT <ArrowBigRightDash aria-hidden='true' />
      </Button>
      <Button 
      variant="danger" 
      id='restartBtn' 
      type='button' 
      aria-label='Restart Quiz' 
      onClick={handleRestart}>
      RESTART <RotateCcw aria-hidden='true' />
      </Button>

    </Stack>
    </div>
  )
}
