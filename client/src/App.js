import React, { useState } from 'react'
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Routes} from 'react-router-dom'
// Import icons from lucide-react
import { Bug } from 'lucide-react';

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

      </Routes>
   </Container>


   </>
  )
}
