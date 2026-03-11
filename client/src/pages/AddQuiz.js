import React, { useState, useCallback, useEffect } from 'react'
import '../css/pagesCSS/AddQuiz.css'
import '../css/pagesCSS/PageSetup.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';

export default function AddQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout,
    currentUser,
    quizName,
    questions,
    setQuizName,
    setQuestions,
    fetchQuizzes,
    quizList
  }
) {
  //=============STATE VARIABLES===================
  const [newQuizForm, setNewQuizForm] = useState(false)
  const [showQuizList, setShowQuizList] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  })
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  //===============REACT HOOKS=============
  useEffect(() => {
    fetchQuizzes();// Call the function to fetch quizzes
  },[fetchQuizzes])

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

  //===============EVENT LISTENERS====================
  //Function to toggle Add Quiz form
  const toggleAddQuiz =  () => setNewQuizForm((prev) => !prev);
  
  //=============JSX RENDERING=======================
  return (
    <Container id='pageContainer'>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='ADD QUIZ'/>
      <section id='quizList'>
        <Row id='quizListRow' aria-live='polite'>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='toggleQuizListCol'>
            {/* TOGGLE TABLE BUTTON */}
            <Button
              variant='secondary'
              type='button'
              id='toggleQuizListBtn'
              onClick={() => setShowQuizList((prev) => !prev)}
              aria-expanded={showQuizList}
              aria-controls='quizListTableRow'
            >
              {showQuizList ? 'HIDE QUIZZES' : 'SHOW QUIZZES'}
            </Button>
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
        {/* Quiz list + edit quiz form */}
        {showQuizList && (
          <Row id='quizListTableRow' aria-live='polite'>
            <Col xs={3} md={2}></Col>
            <Col xs={12} md={8} id='quizListCol'>
              <Table striped bordered hover responsive aria-label='Quiz list' id='quizListTable'>
                <thead id='tableHeading'>
                  <tr id='tableRow'>
                    <th id='quizListTitle'>Title</th>
                    <th id='quizListDescription'>Description</th>
                    <th id='quiz created by'>Created By</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizList.length === 0 ? (
                    <tr>
                      <td colSpan={3}><p id='errorMessage'>NO QUIZZES FOUND</p></td>
                    </tr>
                  ) : (
                    quizList.map((quiz) => (
                      <tr key={quiz._id}>
                        <td>{quiz.title}</td>
                        <td>{quiz.description}</td>
                        <td>{quiz.username}</td>
                        <td>
                        {/* Delete quiz button: only available to user who created the quiz and admin users */}
                        <Button variant='danger'>DELETE QUIZ</Button>
                          
                          {/*Toggle Edit quiz button: only available to user who created the quiz and admin users */}
                          {/* Display edit quiz if the form is not active and exit if the form is active */}
                          <Button variant='warning'>EDIT QUIZ/EXIT</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
            <Col xs={3} md={2}></Col>
          </Row>
        )}
      </section>
      <section id='newQuizSection'>
        {/* ADD QUIZ FORM */}
        <Row id='addQuizRow'>
        <Col xs={4} md={2} id='addQuizCol1'></Col>
        <Col xs={12} md={8} id='addQuizCol'>
        <div id='toggle-btn-div'>
          {/* Button to toggle AddQuizForm */}
          <h6 className='btnText'>CLICK HERE TO:</h6>
          <Button 
          variant="info" 
          id='toggleAddQuizBtn' 
          type='button' 
          onClick={toggleAddQuiz}
          aria-label='Button to toggle add Quiz form'
          aria-pressed={newQuizForm}
          aria-expanded={newQuizForm}
          aria-controls='add-quiz-panal'
          >
          ADD NEW QUIZ
          </Button>
        </div>
        {/* Conditional rendering Only display if form is displayed */}
        {newQuizForm && (
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
        )}           
        </Col>
        <Col xs={4} md={2} id='addQuizCol2'></Col>
        </Row>
      </section>
      {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
