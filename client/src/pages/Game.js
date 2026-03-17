// Game.js
// Game component: display quiz, quiz results and past quiz scores
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useEffect, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Game.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
import SelectQuizForm from '../components/SelectQuizForm';
import QuizDisplay from '../components/QuizDisplay';
import Button from 'react-bootstrap/Button';
import PastScores from '../components/PastScores';
// IMPORT ICONS FROM LUCIDE-REACT
import { CircleQuestionMark, Trophy  } from 'lucide-react';
// IMPORT UTILITY FUNCITON
import { shuffleArray } from '../utilFunctions/quizFunctions';

//===========MAIN GAME FUNCTION COMPONENT==========
export default function Game(//Export default Game function component
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
  logout,         // Function to log the user out
  currentUser,    // Object containing the currently logged-in user's details
  quizList,       // Array of all available quizzes
  fetchQuizzes,   // Function to fetch all quizzes from the server
  setError,       // Function to set the global error state
  setQuizList,    // Function to update the quiz list state
  setQuizName,    // Function to set the name of the selected quiz
  setQuestions,   // Function to set the questions for the selected quiz
  quiz,           // Object containing the currently active quiz data
  setQuiz,        // Function to set the active quiz
  userScores,     // Array of the current user's past quiz scores
  setUserScores,  // Function to update the user's scores state
  selectedQuiz,   // Object representing the quiz selected for review in past scores
  setSelectedQuiz,// Function to set the selected past quiz
  loggedIn,       // Boolean indicating whether the user is logged in
  fetchUserScores,// Function to fetch the current user's scores from the server
  quizName,       // String storing the name of the currently active quiz
  questions,      // Array of questions for the currently active quiz
}) {
  // ==========STATE VARIABLES============
  // Quiz variables
  const [selectedQuizId, setSelectedQuizId] = useState();// State to store the selected quiz ID
  // Timer variables
  const [timer, setTimer] = useState(10);// State to store the countdown timer value (seconds)
  const [quizTimer, setQuizTimer] = useState()// State to store the quiz timer interval reference
  // Score variables
  const [showPastScores, setShowPastScores] = useState(false)//State to toggle past scores display

   //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    let isMounted = true;// Track whether the component is still mounted to prevent state updates after unmount
    const loadQuizzes = async () => {//Define an async function to load quizzes
      try {
        fetchQuizzes()// Call the fetchQuizzes function passed down from App.js
      } catch (error) {
        if(isMounted) setError('Error fetching quizzes', error)// Only update state if component is still mounted
          console.error('Failed to fetch quizzes');//Log an error message in the console for debugging purposes
      }
    }
    loadQuizzes();// Call the loadQuizzes function when the component mounts
    return () => {isMounted = false}// Cleanup: set isMounted to false when the component unmounts
  },[fetchQuizzes, setError])

 
  //==========REQUEST===========
  //----------GET----------------
  // Function to fetch a single quiz by quizId
  const fetchQuiz = useCallback(async (quizId) => {
    try {
      //Conditional rendering to check if a quiz is selected
      if(!quizId) return;

      const token = localStorage.getItem('token');//Retrieve authentication token from localStorage

      // Send a GET request to the server fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quizzes/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',//Enable Cors for cross-origin resourcing
        headers: {
          'Content-Type': 'application/json',//Specify the content-type in the payload as JSON
          'Authorization': `Bearer ${token}`,//Attatch the token in the request Header
        }
      })

      /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');//Throw an error message if the GET request is unsuccessful
      }

       const fetchedData = await response.json(); // Parse the JSON response
      console.log(fetchedData)//Log the Quiz Data in the console for debugging purposes

      // Conditional rendering to check if fetchedData is valid
      if (!fetchedData || !fetchedData.quiz || !fetchedData.quiz.questions) {
        throw new Error('Invalid quiz data');// Throw error if the data type is invalid
      }

      const fetchedQuiz = fetchedData.quiz; // Parse the JSON response

       // Shuffle the questions to randomize their order
      const shuffledQuestions = fetchedQuiz.questions.map(question => {
        const optionsWithCorrectAnswer = [...question.options, question.correctAnswer];// Combine options and correct answer
        const shuffledOptions = shuffleArray(optionsWithCorrectAnswer);// Shuffle the options
        return { ...question, options: shuffledOptions }; // Return the question with shuffled options
      });

      // Update quiz list and set quiz details
      setQuizList(prevQuizList =>
        // Update the quiz list
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );
      setQuestions(shuffledQuestions);
      setQuizName(fetchedQuiz.title);// Set the quiz name
      setQuiz(fetchedQuiz);// Set the fetched quiz
      console.log(fetchedQuiz.title);//Log the fetched quiz name in the console for  debugging purposes
    } catch (error) {
      setError(`Error fetching quiz: ${error.message}`);// Set the error state and an error messsage
      console.error(`Error fetching quiz: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  },[setQuizName, setQuizList,setError, setQuestions,setQuiz ])


  //=========JSX RENDERING===============
  return (
    <Container id='pageContainer' role='main'>
      {/* HEADER */}
      {/* Render the Header component with "GAME" as the heading */}
      <Header currentUser={currentUser} heading='GAME'/>
      {/* SECTION 1: quizdisplay component and 
      select quiz form component */}
      <section id='quizSection'>
        {/* SELECT QUIZ FORM */}
         <Row id='selectQuizRow'>
          <Col></Col>
          <Col xs={6} id='selectQuizCol'>
          {/* Render the SelectQuizForm function component */}
            <SelectQuizForm
              quizList={quizList}
              selectedQuizId={selectedQuizId}
              setSelectedQuizId={setSelectedQuizId}
            />
          </Col>
          <Col></Col>
      </Row>
      {/* ============EVENT/ANIMATION=============== */}
      {/* Only display after quiz is selected */}
      <Row  id='selectQuizEventRow' aria-hidden='true' role='presentation' aria-live='polite'>
       <Col id='selectQuizEventCol'>
          <div id='event-bar'>
            <div className='event-track'>
              <CircleQuestionMark className='event-slide' size={32} aria-hidden='true' focusable="false"/>
            </div>
          </div>
       </Col>
      </Row>
      {/* ===========QUIZ DISPLAY============= */}
      {/* START QUIZ FORM + QUIZ  */}
          <div id='display-quiz-panal'>
          {/* Render the QuizDisplay Function component */}
            <QuizDisplay
              quiz={quiz}
              setQuiz={setQuiz}
              setQuizTimer={setQuizTimer}
              timer={timer}
              setError={setError}
              setTimer={setTimer}
              currentUser={currentUser}
              selectedQuizId={selectedQuizId}
              setSelectedQuizId={setSelectedQuizId}
              quizTimer={quizTimer}
              fetchQuiz={fetchQuiz}
              quizName={quizName}
              setUserScores={setUserScores}
              questions={questions}
            />
          </div>
      </section>
      {/* SECTION 2: Past Quiz Results + Toggle Results  */}
      <section id='scoresSection'>
        {/* PAST QUIZ RESULTS*/}
        <Row id='pastScoresRow'>
        
        <Col  id='pastScoresCol'>
        <div className='toggle-btn-div'>
        {/* BUTTON TO TOGGLE PAST SCORES */}
          <h6 className='btnText'>CLICK HERE TO:</h6>
          <Button 
          id='togglePastScoresBtn' 
          variant='primary' 
          onClick={() => setShowPastScores(prev => !prev)}
          aria-label='Button to toggle the past scores'
          aria-pressed={showPastScores}
          aria-expanded={showPastScores}
          aria-controls='past-results-panal'
          >
            {showPastScores ? 'HIDE PAST SCORES' : 'VIEW PAST SCORES'}
          </Button><Trophy fill='#AA9000' aria-hidden='true'/>
        </div>
        {/* TOGGLE PAST SCORES */}
          {showPastScores && (
          <div id='past-results-panal'>
          <PastScores
            userScores={userScores}
            fetchUserScores={fetchUserScores}
            loggedIn={loggedIn}
            setSelectedQuiz={setSelectedQuiz}
            selectedQuiz={selectedQuiz}
          />
          </div>
          )}
        </Col>
      </Row>
      </section>
      {/* FOOTER */}
      {/* Render the Footer Component */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
