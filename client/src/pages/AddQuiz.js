import React, { useState } from 'react'
import '../css/pagesCSS/AddQuiz.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';
export default function AddQuiz({logout, currentUser, quizName, questions, setQuizName}) {
  //=============STATE VARIABLES===================
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  })
  //=============JSX RENDERING=======================
  return (
    <Container>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='ADD QUIZ'/>
      <section id='quizList'>
      {/* Quiz list + edit quiz form */}
      {/* Edit quiz instructions */}
      </section>
      <section id='newQuizSection'>
        {/* ADD QUIZ FORM */}
        <Row id='addQuizRow'>
        <Col xs={4} md={2}></Col>
        <Col xs={12} md={8} id='addQuizCol'>
        <div>
          {/* Button to toggle AddQuizForm */}
          <Button variant="info" id='toggleAddQuizBtn' type='button'>ADD QUIZ FORM</Button>
        </div>
        {/* Only display if form is displayed */}
            <div id='add-quiz-panal'>
                <AddQuizForm 
                questions={questions}
                currentUser={currentUser}
                  quizName={quizName}
                  setCurrentQuestion={setCurrentQuestion}
                  setQuizName={setQuizName}
                  currentQuestion={currentQuestion}
                />
            </div>
        </Col>
        <Col xs={4} md={2}></Col>
         
        </Row>
        
      </section>
      {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
