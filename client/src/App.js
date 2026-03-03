import React, { useEffect, useState } from 'react'
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Route, Routes} from 'react-router-dom'
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
  // const [users, setUsers] = useState([])
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

  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    // Function to fetch all users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage('token')

      } catch (error) {
        
      }
    }

    // Function to fetch a (current) single user
    const fetchCurrentUser = async () => {
      
    }


  },[])
  //=================================================
  return (
   <>
   <Container role='main'>
     <Row>
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
            <Users/>
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
