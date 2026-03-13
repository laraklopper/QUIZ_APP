import React from 'react'
import '../css/pagesCSS/PageSetup.css'
import '../css/pagesCSS/Users.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Users({logout, currentUser}) {
  return (
    <Container id='pageContainer'>
     {/* HEADER */}
     {/* Render the Header component with USERS as the heading */}
     <Header heading='USERS' currentUser={currentUser}/>
     {/* SECTION 1: User List */}
     <section id='userList'>
      {/* USERS LIST */}
         <Row id='userListHeadingRow'>
        <Col id='userListHeadCol1'></Col>
        <Col xs={5} id='userListHeadCol'>
          <h2 id='userListHeading'>USERS:</h2>
        </Col>
        <Col id='userListHeadCol2'></Col>
      </Row>
      <Row id='userListRow'>
      <Col xs={3} md={2} id='userListCol1'></Col>
        <Col xs={12} md={8} id='userListCol'>
          {/* Users list table 
          display 
          username
          full name: first name & last name
          email 
          date of birth
          badge stating if user is admin
          deleteUserBtn (dont allow user to delete admin user)
          */}
        </Col>
        <Col xs={3} md={2} id='userListCol2'></Col>
      </Row>
     </section>
     {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
