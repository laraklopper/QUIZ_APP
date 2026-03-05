import React from 'react'
import Container from 'react-bootstrap/Container';
import Footer from '../components/Footer';
export default function AddQuiz({logout}) {
  return (
    <Container>
      {/* HEADER */}
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
