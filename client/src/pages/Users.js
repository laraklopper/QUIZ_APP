import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';

export default function Users({logout, users}) {
  return (
    <Container>
      <Footer logout={logout}/>
    </Container>
  )
}
