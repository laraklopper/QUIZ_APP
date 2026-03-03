import React from 'react'
import Container from 'react-bootstrap/Container';
import MainHeader from '../components/MainHeader';

export default function Registration() {
  return (
    <Container id='registrationContainer' role='main'>
      <MainHeader mainHeading={'REGISTRATION'}/>
      <section id='regisSection'>
        {/* Registration Form */}
      </section>
    </Container>
  )
}
