//AddQuiz.js
import React, { useState, useCallback, useEffect } from 'react'
import '../css/pagesCSS/AddQuiz.css'
import '../css/pagesCSS/PageSetup.css'
import '../css/componentCSS/QuizData.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
// CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';
import EditQuizForm from '../components/EditQuizForm';

//=============MAIN ADDQUIZ COMPONENT==============
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
  const [editQuizId, setEditQuizId] = useState(null)
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

      if (!currentUser) {
        setError('You must be logged in to create a quiz.');
        return;
      }
      if (!quizName) {
        setError('Please enter a quiz name.');
        return;
      }
      if (!description) {
        setError('Please enter a quiz description.');
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
          username: currentUser.username,
          questions,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setQuizName('');
        setDescription('');
        setQuestions([]);
        setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
        fetchQuizzes();
      } else {
        throw new Error(data.message || 'Failed to create quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js]', error.message);
      setError(error.message);
    }
  }, [quizName, description, questions, currentUser, setQuizName, setQuestions, fetchQuizzes]);

  // Function to delete a quiz by ID
  const deleteQuiz = useCallback(async (quizId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quizzes/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete quiz.');
      }
      if (editQuizId === quizId) {
        setEditQuizId(null);
        setQuizName('');
        setDescription('');
        setQuestions([]);
      }
      fetchQuizzes();
    } catch (error) {
      console.error('[ERROR: AddQuiz.js, deleteQuiz]', error.message);
      setError(error.message);
    }
  }, [editQuizId, fetchQuizzes, setQuizName, setQuestions]);

  // Function to toggle the edit form for a quiz
  const handleEditToggle = useCallback((quiz) => {
    if (editQuizId === quiz._id) {
      setEditQuizId(null);
      setQuizName('');
      setDescription('');
      setQuestions([]);
    } else {
      setEditQuizId(quiz._id);
      setQuizName(quiz.title);
      setDescription(quiz.description);
      setQuestions(quiz.questions);
      setNewQuizForm(false);
    }
  }, [editQuizId, setQuizName, setQuestions]);

  // Function to submit edits to an existing quiz
  const editQuiz = useCallback(async () => {
    try {
      setError(null);
      if (!editQuizId) return;
      if (!quizName) { setError('Please enter a quiz name.'); return; }
      if (!description) { setError('Please enter a quiz description.'); return; }
      if (questions.length < 5) { setError('Please add 5 questions before submitting.'); return; }
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quizzes/updateQuiz/${editQuizId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quizName,
          description,
          username: currentUser.username,
          questions,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setEditQuizId(null);
        setQuizName('');
        setDescription('');
        setQuestions([]);
        fetchQuizzes();
      } else {
        throw new Error(data.message || 'Failed to update quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js, editQuiz]', error.message);
      setError(error.message);
    }
  }, [editQuizId, quizName, description, questions, currentUser, setQuizName, setQuestions, fetchQuizzes]);

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
       
            <Col  id='quizListCol'>
              <Table striped bordered hover responsive aria-label='Quiz list' id='quizListTable'>
                <thead id='tableHeading'>
                  <tr id='tableRow'>
                    <th id='quizListTitle'>Title</th>
                    <th id='quizDescrip'>DESCRIPTION</th>
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
                        <td id='quizTableBtns'>
                        <div id='tableBtnsDiv'>
                        {/* Delete quiz button: only available to user who created the quiz and admin users */}
                        <Button variant='danger' type='button' id='deleteQuizBtn' onClick={() => deleteQuiz(quiz._id)}>DELETE QUIZ</Button>
                          {/*Toggle Edit quiz button: only available to user who created the quiz and admin users */}
                          {/* Display edit quiz if the form is not active and exit if the form is active */}
                          <Button variant='warning' type='button' id='toggleEditQuizBtn' onClick={() => handleEditToggle(quiz)}>{editQuizId === quiz._id ? 'EXIT' : 'EDIT QUIZ'}</Button>
                        </div>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
        <Row id='editQuizRow' aria-live='polite'>
        <Col ></Col>
          <Col xs={12} md={8} id='editQuizCol'>
            <div id='edit-quiz-panal'>
            <EditQuizForm/>

            </div>
          </Col>
          <Col ></Col>
        </Row>
      </section>
      {/* EDIT QUIZ FORM */}
      {editQuizId && (
        <section id='editQuizSection'>
          <Row id='editQuizRow'>
            <Col xs={4} md={2}></Col>
            <Col xs={12} md={8} id='editQuizCol'>
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
                  addQuiz={editQuiz}
                />
              </div>
            </Col>
            <Col xs={4} md={2}></Col>
          </Row>
        </section>
      )}
      <section id='newQuizSection'>
        {/* ADD QUIZ FORM */}
        <Row id='addQuizRow'>
        <Col xs={4} md={2} id='addQuizCol1'></Col>
        <Col xs={12} md={8} id='addQuizCol'>
        <div className='toggle-btn-div'>
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
          {newQuizForm ?'EXIT': 'ADD NEW QUIZ'}
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
