import React, { useCallback, useEffect, useState } from 'react'
import './App.css';
import './css/pagesCSS/Animations.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Route, Routes, useNavigate} from 'react-router-dom'
// Import icons from lucide-react
import { Bug } from 'lucide-react';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Game from './pages/Game'
import ProtectedUserRoute from './protectedRoutes/ProtectedUserRoute'
import ProtectedAdminRoute from './protectedRoutes/ProtectedAdminRoute'
import AddQuiz from './pages/AddQuiz';
import Users from './pages/Users';
export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [userData, setUserData] = useState({
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
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate();
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    // Function to fetch all users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage('token');

        if (!token || !loggedIn) return;

        const response = await fetch(`http://localhost:3001/users/fetchUsers`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        /* Conditional rendering to check if the response
       is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          console.error('[ERROR: App.js]: Failed to fetch Clients');//Log an error message in the console for debugging purposes
          throw new Error("Failed to fetch Clients");//Throw an error message if the GET request is unsuccessful
        }

        const fetchedUsers = await response.json();//Parse the JSON data from the Response body
        //Conditional rendering to ensure the data is an array
        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
          setError(null); 
          console.log(fetchedUsers);
        }

      } catch (error) {
        console.error(`ERROR: App.js: error fetching users`);
        setError(`ERROR: App.js: error fetching users: ${error.message}`);// Set the error state to display the error in the UI
      }
    }

    // Function to fetch a (current) single user
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
         if (!token || !loggedIn) return;// If no token is found, exit the function

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
       // console.log(fetchedCurrentUser);
      } catch (error) {
        console.error('[ERROR: App.js]: Error fetching current user details');
        setError(`Error fetching user details: ${error.message}`)
      }
    }

    if (loggedIn) {
      fetchCurrentUser();
      fetchUsers()
    }


  },[loggedIn, setError])
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
              <Home/>
            </ProtectedUserRoute>
          }/>
          <Route path='/game' element={<ProtectedUserRoute currentUser={currentUser}>
            <Game/>
          </ProtectedUserRoute>}/>
          <Route path='/addQuiz' element={<ProtectedUserRoute currentUser={currentUser}>
            <AddQuiz/>
          </ProtectedUserRoute>} />
          <Route path='/users' element={<ProtectedAdminRoute currentUser={currentUser}>
            <Users logout={logout} users={users}/>
          </ProtectedAdminRoute>}/>
        </>
      ):(
        <>
         <Route exact path='/' element={<Login
         userData={userData}
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
