import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
export default function Game({logout}) {
  return (
    <Container>
      {/* HEADER */}
      <section>
        {/* SELECT QUIZ FORM + VIEW PAST SCORES*/}
      </section>
      <section>
        {/* QUIZ + RESULTS */}
      </section>
      <Footer logout={logout}/>
    </Container>
  )
}
