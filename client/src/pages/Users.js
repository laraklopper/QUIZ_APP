import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Users({logout, currentUser}) {
  return (
    <Container>
     {/* HEADER */}
     <Header heading='USERS' currentUser={currentUser}/>
     <section id='userList'>
      {/* USERS LIST */}
     </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
