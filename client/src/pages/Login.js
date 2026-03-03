import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';
import MainHeader from '../components/MainHeader';


export default function Login({userData}) {
  return (
    <Container>
    <MainHeader mainHeading='LOGIN'/>
      <Row>
            <Col>
                <div>
                    <div></div>
                </div>
            </Col>
        </Row>
        <section id='loginSection'>
      
   <Row id='loginRow'>
        <Col></Col>
        <Col xs={6}>
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
