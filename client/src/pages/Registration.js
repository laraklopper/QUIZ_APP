import React, { useCallback, useState } from 'react'
import '../css/pagesCSS/Register.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import MainHeader from '../components/MainHeader';
import RegistrationForm from '../components/RegistrationForm';
import PageFooter from '../components/PageFooter';
import { useNavigate } from 'react-router-dom';
import { Form } from 'lucide-react';
import { ClipboardList, Pencil  } from 'lucide-react';
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
      <section id='infoSection'>
             <Row id='rulesRow'>
             <Col></Col>
               <Col xs={6} id='rulesCol'>
             <Card id='rulesCard'>
      <Card.Header id='rulesHeader'> <h3 id='regisRequire'><ClipboardList size={28} />REGISTRATION REQUIREMENTS:</h3></Card.Header>
      <ListGroup variant="flush" id='rulesList'>
        <ListGroup.Item id='rule1'>
             <h6 className='rule'>
               <Pencil size={16}/>  THE USERNAME MUST BE UNIQUE AND CONTAIN 3-20 CHARACTERS
              </h6>
        </ListGroup.Item>
        <ListGroup.Item id='rule2'>
           <h6 className='rule'><Pencil  size={16}/>
           PASSWORDS MUST BE AT LEAST 8 CHARACTERS AND AT LEAST ONE SPECIAL CHARACTER
                
              </h6>
        </ListGroup.Item>
        <ListGroup.Item id='rule3'>
        <h6 className='rule'><Pencil size={16} />USER INFORMATION IS PRIVATE AND MAY NOT BE ACCESSED WITHOUT AUTHORIZATION</h6></ListGroup.Item>
        <ListGroup.Item id='rule4'> 
                
                <h6 className='rule'><Pencil size={16}/>USERS MAY ONLY ON INITIAL REGISTRATION REGISTER AS AN
                ADMIN USER</h6>  </ListGroup.Item>
                <ListGroup.Item id='rule5'>
                <h6 className='rule'><Pencil size={16} />BY CREATING AN ACCOUNT, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY POLICY</h6>
                </ListGroup.Item>
      </ListGroup>
    </Card>
        </Col>
        <Col></Col>
      
      </Row>
      </section>
      <PageFooter />
    </Container>
  )
}
