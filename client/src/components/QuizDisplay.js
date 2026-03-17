// QuizDisplay.js
/*QuizDisplay component: Manages and displays the full quiz flow, including the start form,
active quiz questions, and results screen, while handling score submission and quiz state.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useState, useEffect } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/QuizDisplay.css'
// IMPORT BOOTSTRAP COMPONENTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// IMPORT CUSTOM COMPONENTS
import StartQuizForm from './StartQuizForm';
import Quiz from './Quiz';
import Results from './Results';

// QuizDisplay function component
export default function QuizDisplay(//Export default QuizDisplay function component
  {//PROPS PASSED FROM PARENT COMPONENT (Game.js)
  quiz,           // Object containing the full quiz data
  setQuiz,        // Function to update the active quiz state
  timer,          // Number representing the timer reset value (in seconds)
  setTimer,       // Function to update the timer value
  quizTimer,      // Boolean indicating whether the countdown timer is enabled
  setQuizTimer,   // Function to toggle the countdown timer on or off
  currentUser,    // Object containing the currently logged-in user's details
  setError,       // Function to set the global error state
  selectedQuizId, // String storing the ID of the quiz selected by the user
  setSelectedQuizId,// Function to update the selected quiz ID state
  fetchQuiz,      // Function to fetch a single quiz by ID from the server
  quizName,       // String storing the name of the currently active quiz
  setUserScores,  // Function to update the user's scores state
  questions       // Array of shuffled question objects for the active quiz
}) {
  //======STATE VARIABLES===========
  const [quizIndex, setQuizIndex] = useState(0);// State to track the index of the currently displayed question
  // Boolean values to track whether the quiz has started or is completed
  const [quizStarted, setQuizStarted] = useState(false);// True when the user has started the quiz
  const [quizCompleted, setQuizCompleted] = useState(false);// True when the user has answered all questions
  const [currentScore, setCurrentScore] = useState(0);// State to store the user's running score during the quiz
  const [loading, setLoading] = useState(true);// State to indicate whether quiz data is still being fetched

  //==============USE EFFECT HOOK========================
  // Fetch the selected quiz whenever the selectedQuizId changes
  useEffect(() => {
    const setup = async () => {
      try {
        if (selectedQuizId) {
          await fetchQuiz(selectedQuizId)// Fetch the quiz data for the selected quiz ID
        }
      } catch (error) {
        setError(`Error setting up quiz:${error.message}`)// Set the error state to display the error in the UI
        console.error('Setup error:', error);//Log an error message in the console for debugging purposes
      }finally{
        setLoading(false)// Always set loading to false after the fetch completes
      }
    }
    setup();// Call the setup function when the component mounts or selectedQuizId changes
  },[selectedQuizId, fetchQuiz, setError])

  //==============REQUESTS============
  //--------------GET--------------------
  // Function to check if the current user already has a saved score for this quiz
  const checkExistingScore = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');// Retrieve JWT token from localStorage
      if (!token) {
        console.error(`[ERROR: QuizDisplay.js, checkExistingScore]: Authentication required`);//Log an error message in the console for debugging purposes
        return null;
      }
      // Send a GET request to find an existing score for this user and quiz
      const response = await fetch(`http://localhost:3001/scores/findScore/${currentUser.username}/${quizName}`,{
        method: 'GET',// HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type in the request payload
          'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
        }
      })

        // 404 means no score exists yet — return null without throwing an error
        if (response.status === 404) {
          return null;
        }

        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error ('Error fetching scores for the quiz');//Throw an error message if the GET request is unsuccessful
        }

        const result = await response.json();// Parse the JSON response
        return result.userScore || null;// Return the existing score or null if not found

    } catch (error) {
        setError('Error fetching scores');// Set the error state to display the error in the UI
        return null;
    }
  },[setError, currentUser.username, quizName])
  //----------------PUT-----------------------
  // Function to update an existing score if the user's new score is better than the previous one
    const updateScore = useCallback(async (scoreId) => {
      try {
        const token = localStorage.getItem('token');// Retrieve JWT token from localStorage
        if (!token) return;// Exit if no token is found

        // Send a PUT request to update the score for the given score ID
        const response = await fetch(`http://localhost:3001/scores/updateScore/${scoreId}`, {
          method: 'PUT',// HTTP method for full resource updates
          mode: 'cors',// Enable Cross-Origin Resource Sharing
          headers: {
             'Content-Type': 'application/json',// Specify the Content-Type in the request payload
             'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
          },
          body: JSON.stringify({// Send the new score as a JSON string
            score: currentScore
          })
        })

        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error('Error updating score');//Throw an error message if the PUT request is unsuccessful
        }
        const result = await response.json();// Parse the JSON response

        // Only update the local scores state if the score was actually improved on the server
        if (result.success !== false) {
          setUserScores(prevScores => prevScores.map(s => s._id === result._id ? result : s));
        }
      } catch (error) {
         console.error('Error saving score', error.message);//Log an error message in the console for debugging purposes
         setError('Error saving score', error.message)// Set the error state to display the error in the UI
      }
    },[currentScore, setError, setUserScores])
 
    //-------------POST---------------------------
    // Function to save the user's score — updates the existing score if one exists, or creates a new one
    const addScore = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');// Retrieve JWT token from localStorage
        //Conditional rendering to check if token exists
        if (!token) {
          console.log(`[ERROR: QuizDisplay.js, addScore]: Authentication required`);//Log an error message in the console for debugging purposes
          return;// Exit if no token is found
        }
        const existingScore = await checkExistingScore()// Check if a score for this quiz already exists

        if (existingScore) {
          await updateScore(existingScore._id)// Update the existing score if the new score is better
        } else {
          // Send a POST request to create a new score entry
          const response = await fetch('http://localhost:3001/scores/submitScore', {
            method: 'POST',// HTTP request method
            mode: 'cors',// Enable Cross-Origin Resource Sharing
            headers: {
              'Content-Type': 'application/json',// Specify the Content-Type in the request payload
              'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
            },
            body: JSON.stringify({// Convert the score data to a JSON string
              username: currentUser.username,
              quizTitle: quizName,
              score: currentScore,
            })
          })
          /* Conditional rendering to check if the response
          is not successful (status code is not in the range 200-299)*/
          if (!response.ok) {
            throw new Error('Error submitting score');//Throw an error message if the POST request is unsuccessful
          }
          const result = await response.json();// Parse the JSON response
          setUserScores(prevScores => [result, ...prevScores])// Prepend the new score to the scores list
        }
      } catch (error) {
        console.error('Error saving score', error.message);//Log an error message in the console for debugging purposes
        setError('Error saving score');// Set the error state to display the error in the UI
      }
    },[checkExistingScore, updateScore, currentUser.username, quizName, currentScore, setUserScores, setError])
  //================EVENT LISTENERS================
  // Function to start the quiz — fetches the quiz data and resets all quiz state
  const handleQuizStart = useCallback(async (e) => {
    e.preventDefault()// Prevent the default form submission behaviour
    if(!selectedQuizId) return// Exit if no quiz has been selected
    try {
      await fetchQuiz(selectedQuizId)// Fetch the full quiz data for the selected quiz
      setQuizStarted(true)// Mark the quiz as started
      setQuizIndex(0);// Reset the question index to the first question
      setCurrentScore(0);// Reset the score to zero
      setQuizCompleted(false);// Ensure the completed flag is cleared

      if (quizTimer) {
        setTimer(10)// Reset the timer to its default value if the timer is enabled
      }

    } catch (error) {
      setError(`Error starting quiz: ${error.message}`)// Set the error state to display the error in the UI
      console.error('Error starting quiz');//Log an error message in the console for debugging purposes
    }
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex, setError])

  // Function to advance to the next question, or end the quiz if on the last question
  const handleNextMove = useCallback(() => {
    if (quiz && quiz.questions && quizIndex < quiz.questions.length - 1) {
      setQuizIndex(quizIndex + 1)// Move to the next question
      if (quizTimer) setTimer(10)// Reset the timer for the new question
    }
  else{
    // All questions answered — end the quiz and show the results screen
    setQuizStarted(false)
    setQuiz(null)
    setSelectedQuizId(null)
    setQuizCompleted(true)
  }
  },[quiz, quizIndex, quizTimer, setQuizIndex, setQuizStarted, setQuiz, setSelectedQuizId, setTimer, setQuizCompleted])

  // Function to restart the quiz from the beginning
  const handleRestart = useCallback(() => {
    setQuizIndex(0)// Reset to the first question
    setCurrentScore(0)// Reset the score to zero
    setQuizStarted(true)// Mark the quiz as started again
    setQuizCompleted(false)// Clear the completed flag
    if (quizTimer) {
      setTimer(10);// Reset the timer if it is enabled
      handleQuizStart({preventDefault: () => {}})// Re-trigger the start flow to refetch and reshuffle questions
    } else {
      setTimer(null)
    }
  },[quizTimer, handleQuizStart, setTimer])
  //=============JSX RENDERING========
  return (
    <div id='quizDisplay' role='main'>
    {/* ------------SCREEN READER HEADING--------- */}
    <p className='visually-hidden'>QUIZ DISPLAY</p>
    {/* Show the quiz start form if a quiz is selected but not started */}
    {loading && <div id='loadingBlock'><p id='loadingMsg'>Loading...</p></div>}
    {/* --START QUIZ ROW: StartQuizRow-------- */}
       <Row id='startQuizRow' aria-live='polite'>
        <Col  md={12} id='quizStartCol' aria-live='polite'>
        {/* Render child components only when loading is complete */}
        <div id='startQuizBlock' aria-label=''>
        {!loading && selectedQuizId && (
          <div id='start-quiz-panal'>
          <StartQuizForm
            quiz={quiz}
            quizTimer={quizTimer}
            setQuizTimer={setQuizTimer}
            quizStarted={quizStarted}
            handleQuizStart={handleQuizStart}
          />
          </div>
        )}
        </div>
        </Col>
      </Row>
      <Row id='quizDisplayRow'>
        <Col xs={3} md={2}></Col>
        <Col md={8} id='quizDisplayCol'>
          {/* QUIZ */}
          <div id='quizDisplayBlock' aria-labelledby='quiz-display-panal'>
            {!loading && quiz && quizStarted && (
              <div id='quiz-display-panal'>
                <Quiz
                  quiz={quiz}
                  quizIndex={quizIndex}
                  setQuizIndex={setQuizIndex}
                  quizTimer={quizTimer}
                  questions={questions}
                  timer={timer}
                  quizCompleted={quizCompleted}
                  currentScore={currentScore}
                  setCurrentScore={setCurrentScore}
                  handleNextQuestion={handleNextMove}
                  handleRestart={handleRestart}
                />
            </div>
          )}  
          </div>             
        </Col>
        <Col xs={3} md={2}></Col>
      </Row>
      <Row id='quizResultsRow'>
        
        <Col  id='quizDisplayCol'>
          {/* RESULT */}
          {!loading && quizCompleted && (
            <div id='quiz-results-panal'>
            <Results
              totalQuestions={questions.length || 0}
              selectedQuizId={selectedQuizId}
              currentScore={currentScore}
              currentUser={currentUser}
              quizName={quizName}
              addScore={addScore}
              setQuizCompleted={setQuizCompleted}
              handleNextMove={handleNextMove}
              handleRestart={handleRestart}
            />
            </div>
          )}
        </Col>
     
      </Row>
    </div>
  )
}
