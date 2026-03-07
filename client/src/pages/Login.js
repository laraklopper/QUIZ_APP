import React, {useCallback} from 'react'
import '../css/pagesCSS/Login.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import { IdCard } from 'lucide-react';

//=========MAIN LOGIN COMPONENT=========
export default function Login({userData, setUserData, setError, setLoggedIn}) {

    //=============REQUESTS==================
    //Function for user login
    const submitLogin = useCallback(async () => {
        // e.preventDefault();
        try {
            setError?.(null);
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.username,
                    password: userData.password,
                }),
            });

            const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', userData.username);
            localStorage.setItem('loggedIn', 'true');
            setError(null);
            setLoggedIn(true);
            }else{
                throw new Error(data.message || 'Login failed');
            }

            
        } catch (error) {
            console.error('[ERROR: Login.js]', error.message);
            setError(error.message);
        }
    }, [userData, setError, setLoggedIn])


    //=================JSX RENDERING=====================

  return (
    <Container id='loginContainer' role='main'>
    {/* HEADER */}
    {/* Render the MainHeader component 
    with "LOGIN" as the mainHeading */}
    <MainHeader mainHeading='LOGIN'/>
    {/*=========EVENT/ANIMATION===== */}
      <Row id='loginEventRow' aria-hidden='true' role='presentation'>
            <Col id='loginEventCol'>
                <div className='event-bar'>
                    <div className='event-track'>
                         <IdCard  className='event-slide'/>
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