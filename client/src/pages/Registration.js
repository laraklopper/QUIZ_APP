import React, { useState } from 'react'
import '../css/pagesCSS/Register.css'
import Container from 'react-bootstrap/Container';
import MainHeader from '../components/MainHeader';
import RegistrationForm from '../components/RegistrationForm';

export default function Registration() {
  const [newUserData, setNewUserData] = useState({
     username: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
    email: '',
    dateOfBirth: '',
    admin: false,
    password:'',
  })
  return (
    <Container id='registrationContainer' role='main'>
      <MainHeader mainHeading={'REGISTRATION'}/>
      <section id='regisSection'>
        {/* Registration Form */}
        <div id='regis-panel'>
          <RegistrationForm
            newUserData={newUserData}
          />
        </div>
      </section>
    </Container>
  )
}
