//AddQuiz.js
//Import required modules and packages
import React, { useState, useCallback, useEffect } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/AddQuiz.css'
import '../css/pagesCSS/PageSetup.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';
import EditQuizForm from '../components/EditQuizForm';
// IMPORT ICONS FROM LUCIDE-REACT
import { FileQuestionMark } from 'lucide-react';

//=============MAIN ADDQUIZ COMPONENT==============
export default function AddQuiz(//Export default addQuiz function component
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout,
    currentUser,
    quizName,
    questions,
    setQuizName,
    setQuestions,
    fetchQuizzes,
    quizList,
    error,
    setError
  }
) {
  //=============STATE VARIABLES===================
  const [showQuizList, setShowQuizList] = useState(false);//State to toggle quizList
  // New quiz variables
  const [newQuizForm, setNewQuizForm] = useState(false);//State to toggle new quizForm
  const [currentQuestion, setCurrentQuestion] = useState({// State to store data when a new question being added
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  })
  const [description, setDescription] = useState('');//State to store new quiz description
  //EditQuizDetails
  const [editQuizId, setEditQuizId] = useState(null);// State to store the quiz ID of the quiz being updated 

  //===============REACT HOOKS=============
   /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes();// Call the function to fetch quizzes
  },[fetchQuizzes])

  //=============REQUESTS=========================
  // Function to submit a new quiz to the server
  const addQuiz = useCallback(async () => {//Define an async function to add a new quiz
    try {
      setError(null);
      // Conditional rendering to check if the currentUser is loggedIn
      if (!currentUser) {
        setError('You must be logged in to create a quiz.');
        return;// Exit the function to prevent further execution
      }
      //Conditional rendering to check that the quizName is added
      if (!quizName) {
        setError('Please enter a quiz name.');
        return;// Exit the function to prevent further execution
      }
      //Conditional rendering to check that the quiz description is added
      if (!description) {
        setError('Please enter a quiz description.');
        return;// Exit the function to prevent further execution
      }
      //Conditional rendering to check that the quiz has exacly 5 questions
      if (questions.length < 5) {
        setError('Please add 5 questions before submitting.');
        return;// Exit the function to prevent further execution
      }

      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      //Send a POST request to the backend URL to add a new quiz
      const response = await fetch('http://localhost:3001/quizzes/createQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the content-type as json
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify({// Convert the quiz object to a JSON string before sending
          title: quizName,
          description,
          username: currentUser.username,
          questions,
        }),
      });

      const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)

      // Handle the response from the server
      if (response.ok) {
        // Reset the quiz name and questions after successful quiz creation
        setQuizName('');
        setDescription('');
        setQuestions([]);
        setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
        setNewQuizForm(false);
        fetchQuizzes();
        alert('New Quiz successfully added');//Notify user
      } else {
        throw new Error(data.message || 'Failed to create quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js]', error.message);
      setError(error.message);
    }
  }, [quizName, description, questions, currentUser, setQuizName, setQuestions, fetchQuizzes, setError]);

  // Function to delete a quiz by ID
  const deleteQuiz = useCallback(async (quizId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quizzes/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the content-type as json
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: currentUser.username }),
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
      console.error('[ERROR: AddQuiz.js, deleteQuiz]', error.message);//Log an error message in the console for debugging purposes
      setError(`Error deleting quiz: ${error}`);// Set the error state to display the error in the UI
    }
  }, [editQuizId, fetchQuizzes, setQuizName, setQuestions, currentUser, setError]);



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
        method: 'PATCH',//HTTP request method
        mode: 'cors',// Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the content-type as json
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
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
  }, [editQuizId, quizName, description, questions, currentUser, setQuizName, setDescription, setQuestions, fetchQuizzes, setError]);

  //===============EVENT LISTENERS====================
  //Function to toggle Add Quiz form
  const toggleAddQuiz =  () => setNewQuizForm((prev) => !prev);
  
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
  }, [editQuizId, setQuizName, setDescription, setQuestions]);
  //=============JSX RENDERING=======================
  return (
    <Container id='pageContainer' role='main'>
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
              <table aria-label='Quiz list' id='quizListTable'>
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
                        {(currentUser?.admin || quiz.username === currentUser?.username) && (
                          <>
                            {/* Delete quiz button: only available to user who created the quiz and admin users */}
                            <Button variant='danger' type='button' id='deleteQuizBtn' onClick={() => deleteQuiz(quiz._id)}>DELETE QUIZ</Button>
                            {/* Toggle Edit quiz button: only available to user who created the quiz and admin users */}
                            <Button variant='warning' type='button' id='toggleEditQuizBtn' onClick={() => handleEditToggle(quiz)}>{editQuizId === quiz._id ? 'EXIT' : 'EDIT QUIZ'}</Button>
                          </>
                        )}
                        </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
        )}
        {editQuizId && (
          <Row id='editQuizRow' aria-live='polite'>
            <Col xs={4} md={2}></Col>
            <Col xs={12} md={8} id='editQuizCol'>
              <div id='edit-quiz-panal'>
                <EditQuizForm
                  editQuiz={editQuiz}
                  currentUser={currentUser}
                  error={error}
                  quizName={quizName}
                  setQuizName={setQuizName}
                  description={description}
                  setDescription={setDescription}
                  questions={questions}
                  setQuestions={setQuestions}
                  editQuizId={editQuizId}
                />
              </div>
            </Col>
            <Col xs={4} md={2}></Col>
          </Row>
        )}
      </section>
      {/*--------- EVENT/ANIMATION---------- */}
      <Row id='addQuizEventRow' role='presentation' aria-hidden='true' >
        <Col id='addQuizEventCol'>
          <div className='event-bar'>
            <div className='event-track'>
              <FileQuestionMark className='event-slide' size={32} aria-hidden='true' focusable="false"  />
            </div>
          </div>
        </Col>
      </Row>
      <section id='newQuizSection'>
        {/* ADD QUIZ FORM */}
        <Row id='addQuizRow'>
        <Col xs={12} md={12} id='addQuizCol'>
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
        </Row>
      </section>
      {/* FOOTER */}
      <Footer logout={logout} currentUser={currentUser}/>
    </Container>
  )
}
