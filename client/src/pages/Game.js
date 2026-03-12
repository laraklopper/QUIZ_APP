import React from 'react'
import '../css/pagesCSS/PageSetup.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Custom components
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function Game({logout, currentUser}) {
  return (
    <Container id='pageContainer' role='main'>
      {/* HEADER */}
      {/* Render the Header component with GAME as the heading */}
      <Header currentUser={currentUser} heading='GAME'/>
      <section className='quizSection'>
        {/* SELECT QUIZ FORM */}
         <Row>
        <Col>1 of 3</Col>
        <Col xs={6}>

        </Col>
        <Col>3 of 3</Col>
      </Row>
      </section>
      <section>
        {/* PAST QUIZ RESULTS
        */}
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
