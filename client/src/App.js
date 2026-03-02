import React/*, { useState } */from 'react'
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function App() {
  // const [currentUser, setCurrentUser] = useState(null)
  // const [users, setUsers] = useState([])
  // const [error, setError] = useState(null)
  return (
   <>
   <Container role='main'>
     <Row>
        <Col></Col>
        <Col xs={6}>
          {/* GLOBAL ERROR MESSAGE */}
        </Col>
        <Col></Col>
      </Row>
   </Container>


   </>
  )
}
