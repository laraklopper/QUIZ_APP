import React from 'react'
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Users.css'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Users({logout, currentUser}) {
  return (
    <Container id='pageContainer'>
     {/* HEADER */}
     {/* Render the Header component with USERS as the heading */}
     <Header heading='USERS' currentUser={currentUser}/>
     <section id='userList'>
      {/* USERS LIST */}
     </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
