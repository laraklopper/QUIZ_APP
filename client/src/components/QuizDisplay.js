// QuizDisplay.js
import React, { useCallback, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StartQuizForm from './StartQuizForm';
export default function QuizDisplay({
  quiz,
  timer,
  setTimer,
  quizTimer,
  setQuizTimer,
  currentUser,
  setError, 
  selectedQuizId,
  setSelectedQuizId,
  fetchQuiz,
quizName,
userScores,
setUserScores
  
  
}) {
  //======STATE VARIABLES=========== 
  const [quizIndex, setQuizIndex] = useState(0);
  // Boolean values to track whether the quiz has started or is completed 
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0); // State to store the user's score during the quiz
  const [loading, setLoading] =useState(true);  // state to indicate whether or not the component is loading

   //==============USE EFFECT HOOK========================
   //UseEffect to fetch and setup necessary data
  //the useEffect hook ensures that when the QuizDisplay component is rendered 

   //==============REQUESTS============
  //--------------GET--------------------
  //Function to check if a score for the Quiz already exists
  const checkExistingScore = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error(`[ERROR: QuizDisplay.js, checkExistingScore]: Authentication required`);
        return null;
      }
      const response = await fetch(`http://localhost:3001/scores/findQuizScores/${quizName}/${currentUser.username}`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${token}`, 
        }
      })
         /* Conditional rendering to check if the response
          is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error ('Error fetching scores for the quiz');//Throw an error message if the GET request is unsuccessful
        }

        const result = await response.json();
        // console.log("userScores test", userScores);//Log the user Scores in the console for debugging purposes
        // console.log(`results: ${result}`)//Log the JSON response in the console for debugging purposes

        if (Array.isArray(userScores)) {
          const existingScore = result.userScores.find(score => score.name === quizName);// Find the existing score for the current quiz
           if (!existingScore) {
              console.error('No existing score was found for this quiz');
              } 
        } else {
         console.error('Invalid data structure for userScores');
         return null;// Return null if not found
        }

    } catch (error) {
        // console.error('Error fetching scores:', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching scores');// Update the error state to display an error message in the UI
        return null;//Return null in the case of an error
    }
  },[setError, currentUser.username, userScores, quizName])
  //----------------PUT-----------------------
    /*Function to update score if a score for the quiz already 
    exists and is better than the prevous result/score*/
    const updateScore = useCallback(async (scoreId) => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) return;

        const response = await fetch(`http://localhost:3001/scores/updateScore/${scoreId}`, {
          method: 'PUT',
          mode: 'cors',
          headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            score: currentScore
          })
        })

         /* Conditional rendering to check if the response
      is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Error updating score');//Throw and error message if the POST request is unsuccessful
      }
      const result = await response.json();// Parse the JSON response

      // Update the user scores state with the new score
      setUserScores(prevScores => [result, ...prevScores])
      } catch (error) {
         console.error('Error saving score', error.message);//Log an error message in the console for debugging purposes
         setError('Error saving score', error.message)
      }
    },[currentScore, setError, setUserScores])
 
    //-------------POST---------------------------
    // Function to add the user Score if a score does nor exist for the user
    const addScore = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
         if (!token) {
        console.log(`[ERROR: QuizDisplay.js, addScore]: Authentication required`);//Log a message in the console for debugging purposes
        return;//Exit the function if the token is missing
      }
      const existingScore = await checkExistingScore()

      if (existingScore) {
        await updateScore(existingScore)
      }

      } catch (error) {
        
      }
    },[])
  //================EVENT LISTENERS================
  const handleQuizStart = useCallback(async (e) => {
    e.preventDefault()
    if(!selectedQuizId) return
    try {
      await fetchQuiz
      setQuizStarted(true)
      setQuizIndex(0);
      setCurrentScore(0);

      if (quizTimer) {
        setTimer(10)
      }

    } catch (error) {
      setError(`Error starting quiz: ${error.message}`)
      console.error('Error starting quiz');
    }
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex, setError])
  //=============JSX RENDERING========
  return (
    <div>
       <Row>
        <Col xs={3} md={2}>
          
        </Col>
        <Col xs={12} md={8}>
          <StartQuizForm
          quiz={quiz}
            timer={timer}
            setQuizTimer={setQuizTimer}
            quizStarted={quizStarted}
            handleQuizStart={handleQuizStart}
            
          />
        </Col>
        <Col xs={3} md={2}>
         
        </Col>
      </Row>
     
          
       
      {/* START QUIZ FORM */}
      {/* QUIZ */}
      {/* RESULT */}
    </div>
  )
}
