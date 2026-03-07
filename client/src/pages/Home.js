import React from 'react'
import '../css/pagesCSS/Home.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Footer from '../components/Footer';
import Header from '../components/Header';
// Import icons from lucide-react
import { FileUser } from 'lucide-react';

export default function Home({logout, currentUser}) {

   // SAFE DISPLAY VALUES FOR UI
  const firstName = currentUser?.fullName?.firstName || 'First name not provided';
  const lastName = currentUser?.fullName?.lastName || 'Last name not provided';

  return (
    <Container id='homeContainer' role='main'>
     <Header heading='HOME' currentUser={currentUser}/>
      <section id='welcomeSection'>
     <Row id='welcomeRow'>
        <Col></Col>
        <Col xs={6} id='welcomeMsg' aria-live='polite'>
                      {/* welcome msg */}
            <div id='welcomeDiv'>
              <span className='welcomeLabel'>
                <h2 id='welcomeHeading'>WELCOME:</h2>
                <h2 id='welcomeUser'>{`${firstName} ${lastName}`}</h2>
              </span>
            </div> 

        </Col>
        <Col></Col>
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
      {/* SECTION 2 */}
      <section id='userProfile'>
      
      </section>
      <Footer logout={logout}/>
    </Container>
  )
}
