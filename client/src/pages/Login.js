import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';


export default function Login({userData}) {
  return (
    <Container>
        <section id='loginSection'>
        <Row>
            <Col>
                <div>
                    <div></div>
                </div>
            </Col>
        </Row>
   <Row>
        <Col>1 of 3</Col>
        <Col xs={6}>
            <div id='login-panel'>
                <LoginForm userData={userData}/>
            </div>
        </Col>
        <Col>3 of 3</Col>
      </Row>
        </section>
    </Container>
  )
}
