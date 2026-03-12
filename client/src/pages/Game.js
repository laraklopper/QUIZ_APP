import React, { useState } from 'react'
import '../css/pagesCSS/PageSetup.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Custom components
import Footer from '../components/Footer';
import Header from '../components/Header';
import SelectQuizForm from '../components/SelectQuizForm';
export default function Game({logout, currentUser, quizList, fetchQuizzes}) {
  const [selectedQuizId, setSelectedQuizId] = useState();
  // const [timer, setTimer] = useState(10);
  // const [quizTimer, setQuizTimer] = useState()

   //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  //==========REQUEST===========
  //----------GET----------------
  // Function to fetch a single quiz by quizId
  //=========JSX RENDERING===============
  return (
    <Container id='pageContainer' role='main'>
      {/* HEADER */}
      {/* Render the Header component with GAME as the heading */}
      <Header currentUser={currentUser} heading='GAME'/>
      <section className='quizSection'>
        {/* SELECT QUIZ FORM */}
         <Row>
          <Col></Col>
          <Col xs={6}>
            <SelectQuizForm
              quizList={quizList}
              selectedQuizId={selectedQuizId}
              setSelectedQuizId={setSelectedQuizId}
            />
          </Col>
          <Col></Col>
      </Row>
      </section>
      <section>
        {/* PAST QUIZ RESULTS
        */}
      </section>
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
