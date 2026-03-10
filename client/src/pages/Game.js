import React from 'react'
import '../css/pagesCSS/PageSetup.css'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function Game({logout, currentUser}) {
  return (
    <Container id='pageContainer' role='main'>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='GAME'/>
      <section className='quizSection'>
        {/* SELECT QUIZ FORM 
        + QUIZ*/}
      </section>
      <section>
        {/* QUIZ  RESULTS + PAST RESULTS*/}
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
