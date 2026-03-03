import React, { useCallback, useState } from 'react'
import '../css/pagesCSS/Register.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainHeader from '../components/MainHeader';
import RegistrationForm from '../components/RegistrationForm';
import { useNavigate } from 'react-router-dom';
import { Form } from 'lucide-react';
const EMPTY_FORM = {
  username: '',
  fullName: { firstName: '', lastName: '' },
  email: '',
  dateOfBirth: '',
  admin: false,
  password: '',
}

export default function Registration() {
  const navigate = useNavigate()
  const [newUserData, setNewUserData] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
      setError(null)
      navigate('/')
    } catch (err) {
      console.error('[ERROR: Registration.js]', err.message)
      setError(err.message)
    }
  }, [newUserData, navigate])

  const handleClearForm = useCallback(() => {
    setNewUserData(EMPTY_FORM)
    setError(null)
  }, [])

  return (
    <Container id='registrationContainer' role='main'>
      <MainHeader mainHeading={'REGISTRATION'}/>
      <Row id='regisEventRow'>
        <Col id='regisEventCol'>
          <div className='event-bar'>
            <div className='event-track'>
             <Form className='event-slide' />
            </div>
          </div>
        </Col>
      </Row>
      <section id='regisSection'>
        {error && <p id='errorMessage'>{error}</p>}
        {/* Registration Form */}
        <div id='regis-panel'>
          <RegistrationForm
            newUserData={newUserData}
            setNewUserData={setNewUserData}
            onSubmit={handleSubmit}
            onClearForm={handleClearForm}
          />
        </div>
      </section>
    </Container>
  )
}
