import React, { useCallback, useEffect, useState } from 'react'
import '../css/pagesCSS/PageSetup.css'
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

export default function Game({
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
  const [selectedQuizId, setSelectedQuizId] = useState();
  const [timer, setTimer] = useState(10);
  const [quizTimer, setQuizTimer] = useState()

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
       const fetchedQuiz = await response.json(); // Parse the JSON response
      console.log(fetchedQuiz)
      // Conditional rendering to check if fetchedQuiz is valid
      if (!fetchedQuiz || !fetchedQuiz.questions) {
        throw new Error('Invalid quiz data');// Throw error if the data type is invalid
      }
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
      setQuizName(fetchedQuiz.name);// Set the quiz name
      setQuiz(fetchedQuiz);// Set the fetched quiz
      console.log(fetchedQuiz.name);//Log the fetched quiz name in the console for  debugging purposes
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
      <section className='quizSection'>
        {/* SELECT QUIZ FORM */}
         <Row>
          <Col></Col>
          <Col xs={6}>
            <SelectQuizForm
              quizList={quizList}
              selectedQuizId={selectedQuizId}
              setSelectedQuizId={setSelectedQuizId}
            />
          </Col>
          <Col></Col>
      </Row>
          <div>
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
              userScores={userScores}
              setUserScores={setUserScores}
              questions={questions}
            />
          </div>
       
      </section>
      <section>
        {/* PAST QUIZ RESULTS
        */}
        <Row>
        <Col></Col>
        <Col xs={6}>
        <div className='toggleDiv'>
          <h6 className='btnTxt'>CLICK HERE TO:</h6> <Button id='togglePastScoresBtn'></Button>
        </div>
          <div id='past-results panal'>
          <PastScores
            userScores={userScores}
            fetchUserScores={fetchUserScores}
            loggedIn={loggedIn}
            setSelectedQuiz={setSelectedQuiz}
            selectedQuiz={selectedQuiz}
          />

          </div>
        </Col>
        <Col></Col>
      </Row>
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
