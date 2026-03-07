import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function AddQuiz({logout, currentUser}) {
  return (
    <Container>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='ADD QUIZ'/>
      <section id='quizList'>
      {/* Quiz list + edit quiz form */}
      {/* Edit quiz instructions */}
      </section>
      <section>
        {/* ADD QUIZ FORM */}
      </section>
      {/* FOOTER */}
      <Footer logout={logout}/>
    </Container>
  )
}
