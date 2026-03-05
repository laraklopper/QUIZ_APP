import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';

export default function Home({logout}) {
  return (
    <Container>
      {/* Header */}
      {/* SECTION 1 */}
      <section id='welcomeSection'>
        {/* WELCOME MESSAGE */}
      </section>
      {/* SECTION 2 */}
      <section id='userProfile'>
        {/* USER PROFILE */}
        {/* TOGGLE EDIT USER AND EDIT PASSWORD */}
      </section>
      <Footer logout={logout}/>
    </Container>
  )
}
