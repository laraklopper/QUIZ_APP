import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Footer from '../components/Footer';
import Header from '../components/Header'
export default function Home({logout, currentUser}) {
  return (
    <Container>
     <Header heading='HOME' currentUser={currentUser}/>
      <section id='welcomeSection'>
     <Row>
        <Col>1 of 3</Col>
        <Col xs={6}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>

      </section>
      {/* SECTION 2 */}
      <section id='userProfile'>
      
      </section>
      <Footer logout={logout}/>
    </Container>
  )
}
