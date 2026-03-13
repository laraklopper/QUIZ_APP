// Game.js
import React, { useCallback, useEffect, useState } from 'react'
// CSS Stylesheets
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Game.css'
// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Custom components
import Footer from '../components/Footer';
import Header from '../components/Header';
import SelectQuizForm from '../components/SelectQuizForm';
import QuizDisplay from '../components/QuizDisplay';
import Button from 'react-bootstrap/Button';
import PastScores from '../components/PastScores';

//===========MAIN GAME FUNCTION COMPONENT==========
export default function Game(
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
  logout,
  currentUser,
  quizList,
  fetchQuizzes,
  setError,
  setQuizList,
  setQuizName,
  setQuestions,
  quiz,
  setQuiz,
  userScores,
  setUserScores,
  selectedQuiz,
  setSelectedQuiz,
  loggedIn,
  fetchUserScores,
  quizName,
  questions,
}) {
  // ==========STATE VARIABLES============
  // Quiz variables
  const [selectedQuizId, setSelectedQuizId] = useState();
  // Timer variables
  const [timer, setTimer] = useState(10);
  const [quizTimer, setQuizTimer] = useState()
  // Score variables
  const [showPastScores, setShowPastScores] = useState(false)

   //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    let isMounted = true;
    const loadQuizzes = async () => {//Define an async function
      try {
        fetchQuizzes()
      } catch (error) {
        if(isMounted) setError('Error fetching quizzes', error)
          console.error('Failed to fetch quizzes');//Log an error message in the console for debugging purposes 
      }
    }
    loadQuizzes();
    return () => {isMounted = false}
  },[fetchQuizzes, setError])

  //===========
  //Function to randomise answers

 const shuffleArray = (array) => {
    //  Use the JavaScript sort method to shuffle the array
    // The comparison function returns a random value between -0.5 and 0.5
    // This results in a random order for each array element
    return array.sort(() => Math.random() - 0.5);
  }
  //==========REQUEST===========
  //----------GET----------------
  // Function to fetch a single quiz by quizId
  const fetchQuiz = useCallback(async (quizId) => {
    try {
      if(!quizId) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quizzes/findQuiz/${quizId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
       const fetchedData = await response.json(); // Parse the JSON response
      console.log(fetchedData)
      // Conditional rendering to check if fetchedData is valid
      if (!fetchedData || !fetchedData.quiz || !fetchedData.quiz.questions) {
        throw new Error('Invalid quiz data');// Throw error if the data type is invalid
      }
      const fetchedQuiz = fetchedData.quiz;
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
      {/* Render the Header component with GAME as the heading */}
      <Header currentUser={currentUser} heading='GAME'/>
      <section id='quizSection'>
        {/* SELECT QUIZ FORM */}
         <Row id='selectQuizRow'>
          <Col></Col>
          <Col xs={6} id='selectQuizCol'>
            <SelectQuizForm
              quizList={quizList}
              selectedQuizId={selectedQuizId}
              setSelectedQuizId={setSelectedQuizId}
            />
          </Col>
          <Col></Col>
      </Row>
          <div id='display-quiz-panal'>
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
      <section id='scoresSection'>
        {/* PAST QUIZ RESULTS
        */}
        <Row id='pastScoresRow'>
        <Col xs={3} md={2} ></Col>
        <Col xs={12} md={8} id='pastScoresCol'>
        <div className='toggle-btn-div'>
          <h6 className='btnText'>CLICK HERE TO:</h6>
          <Button id='togglePastScoresBtn' variant='primary' onClick={() => setShowPastScores(prev => !prev)}>
            {showPastScores ? 'HIDE PAST SCORES' : 'VIEW PAST SCORES'}
          </Button>
        </div>
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
        <Col xs={3} md={2} ></Col>
      </Row>
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
