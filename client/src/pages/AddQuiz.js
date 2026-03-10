import React, { useState, useCallback } from 'react'
import '../css/pagesCSS/AddQuiz.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';

export default function AddQuiz(
  {
    logout, 
    currentUser, 
    quizName, 
    questions, 
    setQuizName, 
    setQuestions
  }
) {
  //=============STATE VARIABLES===================
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  })
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  //=============REQUESTS=========================
  // Function to submit a new quiz to the server
  const addQuiz = useCallback(async () => {
    try {
      setError(null);

      if (!quizName) {
        setError('Please enter a quiz name.');
        return;
      }
      if (questions.length < 5) {
        setError('Please add 5 questions before submitting.');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/quizzes/createQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quizName,
          description,
          username: currentUser?.username,
          questions,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setQuizName('');
        setDescription('');
        setQuestions([]);
        setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
      } else {
        throw new Error(data.message || 'Failed to create quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js]', error.message);
      setError(error.message);
    }
  }, [quizName, description, questions, currentUser, setQuizName, setQuestions]);

  //=============JSX RENDERING=======================
  return (
    <Container id='pageContainer'>
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
                setQuestions={setQuestions}
                currentUser={currentUser}
                  quizName={quizName}
                  setCurrentQuestion={setCurrentQuestion}
                  setQuizName={setQuizName}
                  currentQuestion={currentQuestion}
                  description={description}
                  setDescription={setDescription}
                  error={error}
                  setError={setError}
                  addQuiz={addQuiz}
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
