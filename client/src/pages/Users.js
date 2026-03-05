import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';

export default function Users({logout, users}) {
  return (
    <Container>
     {/* HEADER */}
     <section id='userList'>
      {/* USERS LIST */}
     </section>
      <Footer logout={logout}/>
    </Container>
  )
}
