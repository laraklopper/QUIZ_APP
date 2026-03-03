import React from 'react'
import '../css/pagesCSS/Register.css'
import Container from 'react-bootstrap/Container';
import MainHeader from '../components/MainHeader';
import RegistrationForm from '../components/RegistrationForm';

export default function Registration() {
  return (
    <Container id='registrationContainer' role='main'>
      <MainHeader mainHeading={'REGISTRATION'}/>
      <section id='regisSection'>
        {/* Registration Form */}
        <div id='regis-panel'>
          <RegistrationForm/>
        </div>
      </section>
    </Container>
  )
}
