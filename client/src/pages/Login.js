// Login.js
// Login Component: Login Form
//IMPORT REQUIRED MODULES AND PACKAGES
import React, {useCallback} from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/Login.css'
import '../css/pagesCSS/PageSetup.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// IMPORT CUSTOM COMPONENTS
import LoginForm from '../components/LoginForm';
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
// IMPORT ICONS FROM LUCIDE-REACT
import { IdCard } from 'lucide-react';

//=========MAIN LOGIN COMPONENT=========
export default function Login(//Export the default Login function component
    {//PROPS PASSED FROM PARENT COMPONENT (App.js)
        userData,   // Object storing the username and password input values
        setUserData,// Function to update the userData state
        setError,   // Function to set the global error state
        setLoggedIn // Function to update the loggedIn state after a successful login
    }
    ) {

    //=============REQUESTS==================
    //-----------POST-----------------------
    // Function to submit the user's login credentials to the server
    const submitLogin = useCallback(async () => {
        try {
            setError?.(null);// Clear any previous error messages
            // Send a POST request with the user's login credentials
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',// HTTP request method
                mode: 'cors',// Enable Cross-Origin Resource Sharing
                headers: {
                    'Content-Type': 'application/json',// Specify the Content-Type in the request payload
                },
                body: JSON.stringify({// Convert the credentials to a JSON string
                    username: userData.username,
                    password: userData.password,
                }),
            });

            const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)

            if (response.ok) {
                // Store the auth token, username and login flag in localStorage on success
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', userData.username);
                localStorage.setItem('loggedIn', 'true');
                setError(null);// Clear any error messages
                setLoggedIn(true);// Update the loggedIn state to trigger the authenticated routes
            }else{
                throw new Error(data.message || 'Login failed');//Throw an error message if the POST request is unsuccessful
            }

        } catch (error) {
            console.error('[ERROR: Login.js]', error.message);//Log an error message in the console for debugging purposes
            setError(error.message);// Set the error state to display the error in the UI
        }
    }, [userData, setError, setLoggedIn])


    //=================JSX RENDERING=====================

  return (
    <Container id='pageContainer' role='main'>
    {/* HEADER */}
    {/* Render the MainHeader component 
    with "LOGIN" as the mainHeading */}
    <MainHeader mainHeading='LOGIN'/>
    {/*=========EVENT/ANIMATION===== */}
      <Row id='loginEventRow' aria-hidden='true' role='presentation'>
            <Col id='loginEventCol'>
                <div className='event-bar'>
                    <div className='event-track'>
                         <IdCard  className='event-slide' aria-hidden='true' size={32}/>
                    </div>
                </div>
            </Col>
        </Row>
        {/* SECTION 1: Login Form */}
        <section id='loginSection'>
        <Row id='loginRow'>
                <Col></Col>
                <Col xs={6} id='loginCol'>
                {/* Login Form */}
                    <div id='login-panel'>
                    {/* Render the LoginForm.js Component */}
                        <LoginForm 
                        userData={userData} 
                        setUserData={setUserData} 
                        submitLogin={submitLogin}/>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </section>
        {/* FOOTER */}
        <PageFooter/>
    </Container>
  )
}