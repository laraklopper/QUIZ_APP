import React from 'react'
import '../css/pagesCSS/Login.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';
import MainHeader from '../components/MainHeader';
import { IdCard } from 'lucide-react';

export default function Login({userData}) {
  return (
    <Container id='loginContainer'>
    <MainHeader mainHeading='LOGIN'/>
      <Row id='loginEventRow'>
            <Col id='loginEventCol'>
                <div className='event-bar'>
                    <div className='event-track'>
                         <IdCard />
                    </div>
                </div>
            </Col>
        </Row>
        <section id='loginSection'>
      
   <Row id='loginRow'>
        <Col></Col>
        <Col xs={6} id='loginCol'>
            <div id='login-panel'>
                <LoginForm userData={userData}/>
            </div>
        </Col>
        <Col></Col>
      </Row>
        </section>
    </Container>
  )
}
