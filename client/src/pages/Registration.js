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

  //Function to registerNewUser
  const addUser = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newUserData),
      })
      const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)
            /* Conditional rendering to check if the response
         is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error(data.message || `Error adding user (Status: ${response.status})`);//Throw an error message if the POST request is unsuccessful
      }

      //5) Store token if the backend returns it
      if (data.token) {
        localStorage.setItem('token', data.token);// Parse the response data as JSON
      }

      //6) Reset form fields after successful registration
      setNewUserData({
         username: '',
          fullName: { 
            firstName: '', 
            lastName: '' 
          },
          email: '',
          dateOfBirth: '',
          admin: false,
          password: '',
      })
      setError(null)
      alert('New user successfully registered');//Notify the user of successful registration
      console.log('New user successfully registered');;//Log a message in the console for debugging purposes

      navigate('/')
    } catch (err) {
      console.error('[ERROR: Registration.js]', err.message)
      setError(err.message)
    }
  }, [newUserData, navigate])

  //=================EVENT LISTENERS=========================
  //Function to clear form
  const handleClearForm = useCallback(() => {
    setNewUserData(EMPTY_FORM)
    setError(null)
  }, [])

  //=====================JSX RENDERING=======================
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
            addUser={addUser}
            onClearForm={handleClearForm}
          />
        </div>
      </section>
      <section id='infoSection'>
             <Row id='rulesRow'>
               <Col id='rulesCol1'></Col>
               <Col xs={6} id='rulesCol'>
                  <Card id='rulesCard'>
                      <Card.Header id='rulesHeader'> 
                        <h3 id='regisRequire'><ClipboardList size={28} />REGISTRATION REQUIREMENTS:</h3>
                      </Card.Header>
                        <ListGroup variant="flush" id='rulesList'>
                            <ListGroup.Item id='rule1'>
                                    <h6 className='rule'><Pencil size={16}/>  THE USERNAME MUST BE UNIQUE AND CONTAIN<br/> 3-20 CHARACTERS</h6>
                            </ListGroup.Item>
                            <ListGroup.Item id='rule2'>
                                    <h6 className='rule'><Pencil  size={16}/>PASSWORDS MUST BE AT LEAST 8 CHARACTERS <br/>AND AT LEAST ONE SPECIAL CHARACTER</h6>
                            </ListGroup.Item>
                            <ListGroup.Item id='rule3'>
                                    <h6 className='rule'><Pencil size={16} />USER INFORMATION IS PRIVATE AND MAY <br/>NOT BE ACCESSED WITHOUT AUTHORIZATION</h6></ListGroup.Item>
                            <ListGroup.Item id='rule4'> 
                                    <h6 className='rule'><Pencil size={16}/>USERS MAY ONLY ON INITIAL REGISTRATION REGISTER<br/> AS AN ADMIN USER</h6>  
                            </ListGroup.Item>
                          <ListGroup.Item id='rule5'>
                                      <h6 className='rule'><Pencil size={16} />BY CREATING AN ACCOUNT, YOU AGREE TO OUR TERMS <br/> OF SERVICE AND PRIVACY POLICY</h6>
                          </ListGroup.Item>
                      </ListGroup>
                   </Card>
                  </Col>
                 <Col rulesCol2></Col>
              </Row>
           </section>
      <PageFooter />
    </Container>
  )
}
