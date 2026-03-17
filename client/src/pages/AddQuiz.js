//AddQuiz.js
/*AddQuiz page component: Displays the Add Quiz page, allowing users to create, edit,
and delete quizzes. Includes a quiz list table, add quiz form, and edit quiz form.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useState, useCallback, useEffect } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/pagesCSS/AddQuiz.css'
import '../css/pagesCSS/PageSetup.css'
// IMPORT BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// IMPORT CUSTOM COMPONENTS
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddQuizForm from '../components/AddQuizForm';
import EditQuizForm from '../components/EditQuizForm';
// IMPORT ICONS FROM LUCIDE-REACT
import { FileQuestionMark } from 'lucide-react';

//=============MAIN ADDQUIZ COMPONENT==============
export default function AddQuiz(//Export default AddQuiz function component
  {//PROPS PASSED FROM PARENT COMPONENT (App.js)
    logout,       // Function to log the user out
    currentUser,  // Object containing the currently logged-in user's details
    quizName,     // String storing the name of the quiz being created or edited
    questions,    // Array of question objects for the quiz being created or edited
    setQuizName,  // Function to update the quiz name state
    setQuestions, // Function to update the questions state
    fetchQuizzes, // Function to fetch all quizzes from the server
    quizList,     // Array of all existing quizzes
    error,        // Global error message string
    setError      // Function to set the global error state
  }
) {
  //=============STATE VARIABLES===================
  const [showQuizList, setShowQuizList] = useState(false);//State to toggle the quiz list table
  const [newQuizForm, setNewQuizForm] = useState(false);//State to toggle the add quiz form
  const [currentQuestion, setCurrentQuestion] = useState({// State to store the current question being built
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  })
  const [description, setDescription] = useState('');//State to store the quiz description being created or edited
  const [editQuizId, setEditQuizId] = useState(null);// State to store the ID of the quiz currently being edited

  //===============REACT HOOKS=====================
  /* useEffect to fetch quizzes when the component mounts
  or when the fetchQuizzes function changes */
  useEffect(() => {
    fetchQuizzes();// Call the function to fetch quizzes from the server
  },[fetchQuizzes])

  //=============REQUESTS==========================
  //--------------POST-----------------------------
  // Function to submit a new quiz to the server
  const addQuiz = useCallback(async () => {
    try {
      setError(null);// Clear any previous errors
      // Check that the user is logged in before allowing quiz creation
      if (!currentUser) {
        setError('You must be logged in to create a quiz.');
        return;// Exit the function to prevent further execution
      }
      // Check that a quiz name has been entered
      if (!quizName) {
        setError('Please enter a quiz name.');
        return;// Exit the function to prevent further execution
      }
      // Check that a quiz description has been entered
      if (!description) {
        setError('Please enter a quiz description.');
        return;// Exit the function to prevent further execution
      }
      // Check that exactly 5 questions have been added
      if (questions.length < 5) {
        setError('Please add 5 questions before submitting.');
        return;// Exit the function to prevent further execution
      }

      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      // Send a POST request to the backend to create the new quiz
      const response = await fetch('http://localhost:3001/quizzes/createQuiz', {
        method: 'POST',
        mode: 'cors',// Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',// Specify the content type as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        },
        body: JSON.stringify({// Convert the quiz data to a JSON string before sending
          title: quizName,
          description,
          username: currentUser.username,
          questions,
        }),
      });

      const data = await response.json().catch(() => ({}));// Safely parse JSON (avoid crash if server returns non-JSON)

      // Handle the response from the server
      if (response.ok) {
        // Reset all form fields after successful quiz creation
        setQuizName('');
        setDescription('');
        setQuestions([]);
        setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
        setNewQuizForm(false);// Close the add quiz form
        fetchQuizzes();// Refresh the quiz list
        alert('New Quiz successfully added');// Notify the user of success
      } else {
        throw new Error(data.message || 'Failed to create quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js]', error.message);// Log the error for debugging
      setError(error.message);// Display the error message in the UI
    }
  }, [quizName, description, questions, currentUser, setQuizName, setQuestions, fetchQuizzes, setError]);

  //--------------PATCH----------------------------
  // Function to submit edits to an existing quiz
  const editQuiz = useCallback(async () => {
    try {
      setError(null);// Clear any previous errors
      if (!editQuizId) return;// Exit if no quiz is selected for editing
      // Validate required fields before sending the request
      if (!quizName) { setError('Please enter a quiz name.'); return; }
      if (!description) { setError('Please enter a quiz description.'); return; }
      if (questions.length < 5) { setError('Please add 5 questions before submitting.'); return; }
      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      // Send a PATCH request to the backend to update the quiz
      const response = await fetch(`http://localhost:3001/quizzes/updateQuiz/${editQuizId}`, {
        method: 'PATCH',// HTTP method for partial updates
        mode: 'cors',// Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',// Specify the content type as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        },
        body: JSON.stringify({// Convert the updated quiz data to a JSON string
          title: quizName,
          description,
          username: currentUser.username,
          questions,
        }),
      });
      const data = await response.json().catch(() => ({}));// Safely parse JSON response
      // Handle the response from the server
      if (response.ok) {
        setEditQuizId(null);// Clear the edit quiz ID to close the edit form
        // Reset all shared form fields
        setQuizName('');
        setDescription('');
        setQuestions([]);
        fetchQuizzes();// Refresh the quiz list to reflect the update
      } else {
        throw new Error(data.message || 'Failed to update quiz.');
      }
    } catch (error) {
      console.error('[ERROR: AddQuiz.js, editQuiz]', error.message);// Log the error for debugging
      setError(error.message);// Display the error message in the UI
    }
  }, [editQuizId, quizName, description, questions, currentUser, setQuizName, setDescription, setQuestions, fetchQuizzes, setError]);

  //---------------------DELETE--------------------
  // Function to delete a quiz by ID
  const deleteQuiz = useCallback(async (quizId) => {
    try {
      setError(null);// Clear any previous errors
      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      // Send a DELETE request to the backend to remove the quiz
      const response = await fetch(`http://localhost:3001/quizzes/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',// Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',// Specify the content type as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        },
        body: JSON.stringify({ username: currentUser.username }),// Send the username for server-side authorisation
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));// Safely parse the error response
        throw new Error(data.message || 'Failed to delete quiz.');
      }
      // If the deleted quiz was open in the edit form, close and reset it
      // If the deleted quiz was open in the edit form, close and reset it
      if (editQuizId === quizId) {
        setEditQuizId(null);
        setQuizName('');
        setDescription('');
        setQuestions([]);
      }
      fetchQuizzes();// Refresh the quiz list to reflect the deletion
    } catch (error) {
      console.error('[ERROR: AddQuiz.js, deleteQuiz]', error.message);// Log the error for debugging
      setError(`Error deleting quiz: ${error}`);// Display the error message in the UI
    }
  }, [editQuizId, fetchQuizzes, setQuizName, setQuestions, currentUser, setError]);

  //===============EVENT LISTENERS=================
  // Function to toggle the add quiz form open or closed
  const toggleAddQuiz = () => setNewQuizForm((prev) => !prev);

  // Function to toggle the edit form for a selected quiz
  const handleEditToggle = useCallback((quiz) => {
    // If the selected quiz is already open in the edit form, close and reset it
    if (editQuizId === quiz._id) {
      setEditQuizId(null);
      setQuizName('');
      setDescription('');
      setQuestions([]);
    } else {
      // Otherwise, open the edit form and populate it with the selected quiz's data
      setEditQuizId(quiz._id);
      setQuizName(quiz.title);
      setDescription(quiz.description);
      setQuestions(quiz.questions);
      setNewQuizForm(false);// Close the add quiz form if it is open
    }
  }, [editQuizId, setQuizName, setDescription, setQuestions]);

  //=============JSX RENDERING=====================
  return (
    <Container id='pageContainer' role='main'>
      {/* HEADER */}
      <Header currentUser={currentUser} heading='ADD QUIZ'/>
      {/* QUIZ LIST SECTION */}
      <section id='quizList'>
        <Row id='quizListRow' aria-live='polite'>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='toggleQuizListCol'>
            {/* Button to show or hide the quiz list table */}
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
        {/* Quiz list table — only rendered when showQuizList is true */}
        {showQuizList && (
          <Row id='quizListTableRow' aria-live='polite'>
            <Col id='quizListCol'>
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
                  {/* Show a message if no quizzes exist, otherwise map over the quiz list */}
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
                            {/* Delete and edit buttons: only visible to the quiz creator or an admin */}
                            {(currentUser?.admin || quiz.username === currentUser?.username) && (
                              <>
                                {/* Delete quiz button */}
                                <Button variant='danger' type='button' id='deleteQuizBtn' onClick={() => deleteQuiz(quiz._id)}>DELETE QUIZ</Button>
                                {/* Toggle edit quiz form button — label changes based on whether this quiz is being edited */}
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
        {/* Edit quiz form — only rendered when a quiz is selected for editing */}
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
      {/* DECORATIVE ANIMATION BAR */}
      <Row id='addQuizEventRow' role='presentation' aria-hidden='true'>
        <Col id='addQuizEventCol'>
          <div className='event-bar'>
            <div className='event-track'>
              <FileQuestionMark className='event-slide' size={32} aria-hidden='true' focusable="false" />
            </div>
          </div>
        </Col>
      </Row>
      {/* ADD QUIZ SECTION */}
      <section id='newQuizSection'>
        <Row id='addQuizRow'>
          <Col xs={12} md={12} id='addQuizCol'>
            <div className='toggle-btn-div'>
              {/* Button to toggle the add quiz form open or closed */}
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
                {newQuizForm ? 'EXIT' : 'ADD NEW QUIZ'}
              </Button>
            </div>
            {/* Add quiz form — only rendered when newQuizForm is true */}
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
