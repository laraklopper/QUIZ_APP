//App.js (client)
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useEffect, useState } from 'react'
// IMPORT CSS STYLESHEETS
import './App.css';
// IMPORT ANIMATIONS CSS
import './css/pagesCSS/Animations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// IMPORT REACT ROUTER COMPONENTS
import {Route, Routes, useNavigate} from 'react-router-dom'
// IMPORT PAGES
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Game from './pages/Game'
import AddQuiz from './pages/AddQuiz';
import Users from './pages/Users';
//IMPORT PROTECTED ROUTES
import ProtectedUserRoute from './protectedRoutes/ProtectedUserRoute'
import ProtectedAdminRoute from './protectedRoutes/ProtectedAdminRoute'
// IMPORT ICONS FROM LUCIDE-REACT
import { Bug } from 'lucide-react';

//=====MAIN APP FUNCTION COMPONENT==============
export default function App() {//Export default App function component
  //=======STATE VARIABLES===============
  //User variables
  const [currentUser, setCurrentUser] = useState(null)//State to store the user currently loggedIn
  const [users, setUsers] = useState([])//State used to store a list of all the users
  const [userData, setUserData] = useState({//State to store userData for login
    username: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
    email: '',
    dateOfBirth: '',
    admin: false,
    password:'',
  })
  // Quiz variables
  const [quiz, setQuiz] = useState(null);//State to store the currently selected quiz
  const [quizName, setQuizName] = useState('');//State to store the quizName 
  const [questions, setQuestions] = useState([])//State to store  the List of questions in the quiz
  const [quizList, setQuizList] = useState([])//State to store the list of quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null);// State to store the selected quiz
  //Score variables
  const [userScores, setUserScores] = useState([]); // State to store the current user's quiz scores
  const [scores, setScores] =useState([]);// State to hold scores
  const [loggedIn, setLoggedIn] = useState(false);//Boolean to track whether or not the user is currently logged in
  const [error, setError] = useState(null)//State to handle errors during data fetching

  //===========Navigation======================
  // Hook to navigate between different routes
  const navigate = useNavigate();
  
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    // Function to fetch all users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token');//Retrieve token from localStorage

        //Conditional rendering to check if the token exists and loggedIn state is true
        if (!token || !loggedIn) return;// If no token is found or User is not logged in, exit the function

        // Send a GET request to retrieve all registered users
        const response = await fetch(`http://localhost:3001/users/findUsers`, {
          method: 'GET', // HTTP request method
          mode: 'cors', // Enable Cross-Origin Resource Sharing
          headers: {
            'Content-Type': 'application/json', // Specify the Content-Type in the request payload
            'Authorization': `Bearer ${token}` // Attach JWT token for authorization
          }
        })
        
        /* Conditional rendering to check if the response
       is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          console.error('[ERROR: App.js]: Failed to fetch Users');//Log an error message in the console for debugging purposes
          throw new Error("Failed to fetch users");//Throw an error message if the GET request is unsuccessful
        }

        const fetchedUsers = await response.json();//Parse the JSON data from the Response body
        //Conditional rendering to ensure the data is an array
        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
          setError(null); 
          console.log(fetchedUsers);
        }

      } catch (error) {
        console.error(`ERROR: App.js: error fetching users`);//Log an error message in the console for debugging purposes
        setError(`ERROR: App.js: error fetching users: ${error.message}`);// Set the error state to display the error in the UI
      }
    }

    // Function to fetch a (current) single user
    const fetchCurrentUser = async () => {//Define an async function to fetch current user details
      try {
        const token = localStorage.getItem('token');//Retrieve token from localStorage
         if (!token || !loggedIn) return;// If no token is found, exit the function

        // Send a GET request to retrieve the currently authenticated user's details
         const response = await fetch(`http://localhost:3001/users/me`, {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin resource sharing mode
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
            'Authorization': `Bearer ${token}`// Attach the token in the Authorization header  
          }
        })

          /* Conditional rendering to check if the response
       is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          console.error(`[ERROR: App.js]: Failed to fetch user details `);//Log an error message in the console for debugging purposes
          throw new Error("Failed to fetch user details");//Throw an error message if the GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json();// Parse the response as JSON and set the current user's details
        
        setCurrentUser(fetchedCurrentUser)// Update state with fetched user details
       // console.log(fetchedCurrentUser);//Log the current user details in the console for debugging purposes
      } catch (error) {
        console.error('[ERROR: App.js]: Error fetching current user details');//Log an error message in the console for debugging purposes
        setError(`Error fetching user details: ${error.message}`)// Set the error state to display the error in the UI       
      }
    }

    //Conditional rendering to check if the user is logged in
    if (loggedIn) {
       /*Call the FetchCurrentUser function to fetch the 
      current user's details*/
      fetchCurrentUser();
       /* Call the FetchUsers function to 
      fetch the list of users*/
      fetchUsers()
    }


  },[loggedIn])
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage

      // Send a GET request to retrieve all available quizzes
      const response = await fetch ('http://localhost:3001/quizzes/findQuizzes', {
        method : 'GET', // HTTP request method
        mode: 'cors', // Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach JWT token to the Authorization header
        }
      })

       /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        console.error('[ERROR: App.js]: Failed to fetch quizzes');//Log an error message in the console for debugging purposes
        throw new Error('Failed to fetch quizzes');//Throw an error message if the GET request is unsuccessful
      }

      const quizData = await response.json();
      if (quizData && Array.isArray(quizData.quizList)) {
        setQuizList(quizData.quizList)
      }else{

      }
    

    } catch (error) {
      setError('Error fetching Quizzes', error);// Set the error state to display the error in the UI       
      console.error('[ERROR: APP.js]: Error fetching Quizzes', error);//Log an error message in the console for debugging purposes
    }
  },[])

   useEffect(() => {
    //Function to fetch all scores
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
        if (!token || !loggedIn) return;// If no token is found, exit the function

        //Send a GET request to the server
        const response = await fetch ('http://localhost:3001/scores/fetchScores', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin Resource Sharing 
          headers: {
            'Content-Type': 'application/json',//Specify the Content-Type in the request payload 
            'Authorization': `Bearer ${token}`// Attach JWT token for authorization
          }
        })

        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error("Failed to fetch user scores");//Throw an error message if the GET request is unsuccessful
        } 
        //Conditional rendering to ensure the data is an array
        const fetchedScores = await response.json();//Parse the response as JSON
        if (fetchedScores && Array.isArray(fetchedScores.scores)) {
                  setScores(fetchedScores.scores)//Update the state
        }
  
        // console.log(fetchedScores);//Log the scores in the console for debugging purposes       
      } catch (error) {
        console.error('Error fetching  scores', error);//Log an error message in the console for debugging purposes
        setError('Error fetching  scores', error)// Set the error state to display the error in the UI       
      }
    }

    //Conditional rendering to check if the user is logged in
    if (loggedIn) {
      fetchScores()//Call the fetchScores function if the user is logged in
    }
  },[loggedIn])

  //Function to fetch scores list from database
const fetchUserScores = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');//Retrieve the JWT token from LocalStorage
    const username = localStorage.getItem('username')//Retrieve the username from localStorage
    //send GET request to server to find scores
    const response = await fetch(`http://localhost:3001/scores/findScores/${username}`, {
      method: 'GET',//HTTP request method
      mode: 'cors',//Enable Cross-Origin Resource Sharing 
      headers: {
        'Content-Type': 'application/json', //Specify the Content-Type in the payload as JSON
        'Authorization': `Bearer ${token}`,//Attatch the token in the Authorization header
      }
    })

    /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
    if (!response.ok) {
      throw new Error('Unable to fetch user scores')//Throw an error message if the GET request is unsuccessful
     }

     const quizScores = await response.json();//Parse JSON response
    
     //Conditional rendering to ensure the data is an array
    if (quizScores && quizScores.userScores && Array.isArray(quizScores.userScores)) {
      setUserScores(quizScores.userScores); // Update state with fetched scores
    }
    else {     
      throw new Error('Invalid data type');//Throw an error message if the data type is invalid
    }
  //  console.log(quizScores);//Log the quizScores in the console for debugging purposes

  } catch (error) {
    console.error('Error fetching userScores', error.message);//Log an error message in the console for debugging purposes
    setError(`Error fetching userScores: ${error.message}`);// Set the error state to display the error in the UI
  }
},[]);
  //===================EVENT LISTENERS=================
  const logout = useCallback(() => {
    //Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');  
    /* Update loggedIn state to reflect that the 
    user is no longer logged in*/
    setLoggedIn(false);
    setError(''); // Clear any existing error messages
    setUserData({
      username: '',
      password: '',
    });//Reset the userData
    /*Use the navigate function to redirect the
    user to the login page after logging out*/
    navigate('/');
  },[navigate])
  //=================================================
  return (
   <>
   <Container role='main' id='appContainer'>
     <Row id='errorRow'>
        <Col></Col>
        <Col xs={6} id='stateCol' aria-live='polite'>
          {/* GLOBAL ERROR MESSAGE */}
          <div id='stateMsg'>
            {error && <p id='errorMessage'>
            <Bug size={20} fontWeight={900} aria-hidden='true'/>{error}</p>
            }
          </div>
        </Col>
        <Col></Col>
      </Row>
      {/* =============ROUTES=================== */}
      <Routes>
      {loggedIn ? (
        <>
          <Route path='/' element={
            <ProtectedUserRoute currentUser={currentUser}>
              <Home
              setError={setError}
                logout={logout}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            </ProtectedUserRoute>
          }/>
          <Route path='/game' element={
            <ProtectedUserRoute currentUser={currentUser}>
            <Game
              quizList={quizList}
              scores={scores}
              fetchQuizzes={fetchQuizzes}
              setQuizList={setQuizList}
              setQuizName={setQuizName}
              setQuestions={setQuestions}
              setError={setError}
              logout={logout}
              currentUser={currentUser}
              quiz={quiz}
              setQuiz={setQuiz}
              userScores={userScores}
              setUserScores={setUserScores}
              selectedQuiz={selectedQuiz}
              setSelectedQuiz={setSelectedQuiz}
              loggedIn={loggedIn}
              fetchUserScores={fetchUserScores}
              quizName={quizName}
              questions={questions}
            />
          </ProtectedUserRoute>}/>
          <Route path='/addQuiz' element={<ProtectedUserRoute currentUser={currentUser}>
            <AddQuiz
            questions={questions}
            quizName={quizName}
            setQuestions={setQuestions}
            setQuizName={setQuizName}
              logout={logout}
              currentUser={currentUser}
              quizList={quizList}
              fetchQuizzes={fetchQuizzes}
              setError={setError}
              error={error}
            />
          </ProtectedUserRoute>} />
          <Route path='/users' element={
            <ProtectedAdminRoute currentUser={currentUser}>
            <Users logout={logout} users={users} setUsers={setUsers} currentUser={currentUser}/>
          </ProtectedAdminRoute>}/>
        </>
      ):(
        <>
         <Route exact path='/' element={<Login
         userData={userData}
         setUserData={setUserData}
         setError={setError}
         setLoggedIn={setLoggedIn}
         />}/>
         <Route path='/reg' element={<Registration/>}/>  
        </>    
      )}
        {/* FALLBACK route */}
          <Route path='*' element={<h2 id='pageNotFound'> 404: Page Not Found</h2>} />

      </Routes>
   </Container>


   </>
  )
}
