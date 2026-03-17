// Home.js
//IMPORT REQUIRED MODULES AND PACKAGES
import React from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/Home.css'
import '../css/pagesCSS/PageSetup.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
import EditUserData from '../components/EditUserData';
// IMPORT ICONS FROM LUCIDE-REACT
import { FileUser } from 'lucide-react';

//=======MAIN HOME FUNCTION COMPONENT=========
export default function Home(//Export default Home function component
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout, 
    currentUser, 
    setError
  }) {

   // SAFE DISPLAY VALUES FOR UI
  const firstName = currentUser?.fullName?.firstName || 'First name not provided';
  const lastName = currentUser?.fullName?.lastName || 'Last name not provided';

  //================JSX RENDERING==============
  return (
    <Container id='pageContainer' role='main'>
    {/* Render the Header componenent with HOME as the heading */}
     <Header heading='HOME' currentUser={currentUser}/>
     {/* Section 1: Welcome Message + Animation */}
      <section id='welcomeSection'>
      <Row id='welcomeRow'>
          <Col id='welcomeCol1'></Col>
          <Col xs={6} id='welcomeMsg' aria-live='polite'>
              {/* welcome msg */}
              <div id='welcomeDiv'>
                <span className='welcomeLabel'>
                  <h2 id='welcomeHeading'>WELCOME:</h2>
                  <h2 id='welcomeUser'>{`${firstName} ${lastName}`}</h2>
                </span>
              </div> 
          </Col>
          <Col id='welcomeCol2'></Col>
        </Row>
      {/* ===========EVENT/ANIMATION============*/}
        <Row id='homeEventRow' aria-hidden='true' role='presentation' aria-live='polite'>
          <Col id='homeEventCol' aria-live='polite'>
            <div className='event-bar'>
              <div className='event-track'>
                <FileUser className='event-slide' size={32} aria-hidden='true' focusable="false" />
              </div>
            </div>
          </Col>
        </Row>
      </section>
      {/* SECTION 2 : user profile + edit user forms */}
      <section id='userProfile'>
        <div id='userProfileBlock'>
          <EditUserData currentUser={currentUser} setError={setError}/>
        </div>
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
