// Registration.js
/* Registration page: displays registrationForm 
and requirements for user registration*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/Register.css'
import '../css/pagesCSS/PageSetup.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
// CUSTOM COMPONENTS
import MainHeader from '../components/MainHeader';
import RegistrationForm from '../components/RegistrationForm';
import PageFooter from '../components/PageFooter';
// IMPORT REACT-ROUTER-DOM COMPONENTS
import { useNavigate } from 'react-router-dom';
// IMPORT ICONS FROM LUCIDE-REACT
import {Form, ClipboardList, Pencil  } from 'lucide-react';

// Default empty form state — defined outside the component to avoid re-creation on every render
const EMPTY_FORM = {
  username: '',
  fullName: { firstName: '', lastName: '' },
  email: '',
  dateOfBirth: '',
  admin: false,
  password: '',
}

//==========MAIN REGISTRATION COMPONENT============
export default function Registration() {//Export the default Registration component
  // Hook to navigate between routes after a successful registration
  const navigate = useNavigate()
  // ===========STATE VARIABLES====================
  const [newUserData, setNewUserData] = useState(EMPTY_FORM)// State to store the new user's registration form data
  const [error, setError] = useState(null)// State to store any error messages from the registration request

  //=============REQUESTS==================
  //-----------POST-----------------------
  // Function to submit the new user's registration data to the server
  const addUser = useCallback(async () => {
    try {
      // Send a POST request to register the new user
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',// HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json'// Specify the Content-Type in the request payload
        },
        body: JSON.stringify(newUserData),// Convert the new user data to a JSON string
      })
      const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)

      /* Conditional rendering to check if the response
         is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error(data.message || `Error adding user (Status: ${response.status})`);//Throw an error message if the POST request is unsuccessful
      }

      // Store the returned token in localStorage if the backend provides one
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Reset all form fields back to empty after a successful registration
      setNewUserData({
         username: '',
          fullName: {
            firstName: '',
            lastName: ''
          },
          email: '',
          dateOfBirth: '',
          admin: false,
          password: '',
      })
      setError(null)// Clear any existing error messages
      alert('New user successfully registered');//Notify the user of successful registration
      console.log('New user successfully registered');//Log a message in the console for debugging purposes

      navigate('/')// Redirect the user to the login page after successful registration
    } catch (err) {
      console.error('[ERROR: Registration.js]', err.message);//Log an error message in the console for debugging purposes
      setError(err.message)// Set the error state to display the error in the UI
    }
  }, [newUserData, navigate])

  //=================EVENT LISTENERS=========================
  // Function to reset all form fields back to their empty state
  const handleClearForm = useCallback(() => {
    const confirmClear = window.confirm("Are you sure you want to clear the form?");// Prompt the user to confirm before clearing
    if (!confirmClear) return;// Exit if the user cancels
    setNewUserData(EMPTY_FORM)// Reset all form fields to the empty state
    setError(null)// Clear any existing error messages
  }, [])

  //=====================JSX RENDERING=======================
  return (
    <Container id='pageContainer' role='main'>
      <MainHeader mainHeading={'REGISTRATION'}/>
      {/* ---------EVENT/ANIMATION---------- */}
      <Row id='regisEventRow' role='presentation' aria-hidden='true'>
        <Col id='regisEventCol'>
          <div className='event-bar'>
            <div className='event-track'>
             <Form className='event-slide' aria-hidden='true' />
            </div>
          </div>
        </Col>
      </Row>
      {/* SECTION 1: Registration Form */}
      <section id='regisSection'>
        {error && <p id='errorMessage'>{error}</p>}
        {/* Registration Form */}
        <div id='regis-panel'>
        {/* Render the RegistrationForm Component */}
          <RegistrationForm
            newUserData={newUserData}
            setNewUserData={setNewUserData}
            addUser={addUser}
            onClearForm={handleClearForm}
          />
        </div>
      </section>
      {/* SECTION 2: Registration Information */}
      <section id='infoSection'>
             <Row id='rulesRow'>
               <Col id='rulesCol1'></Col>
               <Col xs={6} id='rulesCol'>
                  <Card id='rulesCard' aria-labelledby='registrationRequirements'>
                      <Card.Header id='rulesHeader'> 
                      <p className='visually-hidden' id='registrationRequirements'>REGISTRATION RULES</p>
                        <h3 id='regisRequire'><ClipboardList size={28} aria-hidden='true'/>REGISTRATION REQUIREMENTS:</h3>
                      </Card.Header>
                        <ListGroup variant="flush" id='rulesList'>
                            <ListGroup.Item id='rule1'>
                                    <h6 className='rule'><Pencil size={16} aria-hidden='true'/>  THE USERNAME MUST BE UNIQUE AND CONTAIN<br/> 3-20 CHARACTERS</h6>
                            </ListGroup.Item>
                            <ListGroup.Item id='rule2'>
                                    <h6 className='rule'><Pencil  size={16} aria-hidden='true'/>PASSWORDS MUST BE AT LEAST 8 CHARACTERS <br/>AND AT LEAST ONE SPECIAL CHARACTER</h6>
                            </ListGroup.Item>
                            <ListGroup.Item id='rule3'>
                                    <h6 className='rule'><Pencil size={16} aria-hidden='true' />USER INFORMATION IS PRIVATE AND MAY <br/>NOT BE ACCESSED WITHOUT AUTHORIZATION</h6></ListGroup.Item>
                            <ListGroup.Item id='rule4'> 
                                    <h6 className='rule'><Pencil size={16} aria-hidden='true'/>USERS MAY ONLY ON INITIAL REGISTRATION REGISTER<br/> AS AN ADMIN USER</h6>  
                            </ListGroup.Item>
                          <ListGroup.Item id='rule5'>
                                      <h6 className='rule'><Pencil size={16} aria-hidden='true'/>BY CREATING AN ACCOUNT, YOU AGREE TO OUR TERMS <br/> OF SERVICE AND PRIVACY POLICY</h6>
                          </ListGroup.Item>
                      </ListGroup>
                   </Card>
                  </Col>
                 <Col id='rulesCol2'></Col>
              </Row>
           </section>
           {/* Render the PageFooter component */}
      <PageFooter />
    </Container>
  )
}
