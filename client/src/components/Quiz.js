// Quiz.js
// Import necessary modules and packages
import React, { useEffect, useState } from 'react'
// CSS Stylesheets
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/Quiz.css'
// Bootstrap
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// Import Icons from Lucide-React
import { ArrowBigRightDash, RotateCcw, X ,Check, MessageCircleQuestionMark} from 'lucide-react';

// Quiz function component
export default function Quiz(//Export default Quiz function component
  {//PROPS PASSED FROM PARENT COMPONENT (QuizDisplay.js)
    quiz,
    quizIndex,
    setQuizIndex,
    setCurrentScore,
    currentScore,
    questions,
    quizTimer,
    timer,
    // FUNCTIONS
    handleNextQuestion,
    handleRestart

  }
) {
  //============STATE VARIABLES================
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)

  // ========USE EFFECT HOOK==================
  /* Effect to reset the question index to the first 
  question when the questions array changes */
  useEffect(() => {
    if (questions.length > 0) {
      setQuizIndex(0)
    }
  },[questions, setQuizIndex])
  
  // Effect to manage the timer countdown
  useEffect(() => {
    if(!quizTimer) return;

    setTimeLeft(timer)
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted) {
        setTimeLeft((prevTime) => {
          if (prevTime <=1) {
            clearInterval(interval);
            handleNextQuestion()
            return 0
          }
          return prevTime - 1
        })
      }
    }, 1000);
    return() => {
      isMounted = false
      clearInterval(interval)
    }
  },[timer, handleNextQuestion, quizTimer])

  // Display loading text if quiz or questions are not available
  if (!quiz || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  //=============UTILITY FUNCTION==============
    // Function to format the timer into mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);  // Calculate the number of minutes
    const secs = seconds % 60; // Calculate the remaining seconds
    // Return the formatted time as a string in mm:ss format
    // Pad seconds with a leading zero if less than 10
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // ============EVENT LISTENERS=================
  /* Function to handle answer selection and 
  update the score if correct */
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setCurrentScore(currentScore + 1)
      setFeedback(<p className='correctFeedback'>CORRECT <Check fontWeight={700} aria-hidden='true'/></p>)
    } else {
      setFeedback(<p className='incorrectFeedback'>INCORRECT <X fontWeight={700} aria-hidden='true' /> </p>);
    }
    setTimeout(() => setFeedback(''), 1000)
  }

    /* Function to handle option click and 
  update the selected option */
  const handleOptionClick = (option) => {
    setSelectedOption(option);  // Update the selected option
    /*Check if the selected option is the correct 
    answer and update the score accordingly*/
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
    //Call the handleNextQuestion function and move to the next question
    handleNextQuestion();
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
           {questions[quizIndex].options.map((option, index) => (
                <Button
                  key={index}
                  id='answerOption'
                  name='options'
                  checked={selectedOption=== option}
                  type='button'
                  variant='success'
                  aria-describedby='questionText'
                  onClick={() => handleOptionClick(option)}//Call the handle option click fucntion
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
