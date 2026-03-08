import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function Game({logout, currentUser}) {
  return (
    <Container>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='GAME'/>
      <section>
        {/* SELECT QUIZ FORM + VIEW PAST SCORES*/}
      </section>
      <section>
        {/* QUIZ + RESULTS */}
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
