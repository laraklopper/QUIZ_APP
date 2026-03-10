// AddQuizForm.js
import React, { useCallback } from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/AddQuizForm.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Asterisk} from 'lucide-react';
import NewQuestionsList from './NewQuestionsList';

export default function AddQuizForm(
  {currentUser, quizName, setQuizName, currentQuestion, setCurrentQuestion, questions, setQuestions, setError,
   description, setDescription, error, addQuiz}) {
  
    //============EVENT LISTENERS=========================
  //Function to add a new question
  const handleAddQuestion = useCallback (() => {
    //Conditional rendering to ensure that the quiz has 5 questions
    if (questions.length >= 5) {
      console.log('You must add up to 5 questions.');//Log a message in the console for debugging purporses
      return; // Exit the function if max questions reached
    }
    /*Conditional rendering to check that all fields of the 
    current question (text, correct answer, and options) are filled*/
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer || currentQuestion.options.some(opt => !opt)) {
      // setErrorMessage('Please fill in all fields before adding a question.');// Set the error state to display the error in the UI
      setError('Please fill in all fields before adding a question.');// Set the error state to display the error in the UI
      return;// Exit the function to prevent adding incomplete questions
    }
    // Add the current question to the questions array
    setQuestions([...questions, currentQuestion]);
    // Reset the current question fields to their initial state
    setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] })

  },[currentQuestion, questions, setCurrentQuestion, setError, setQuestions])

  //Function to resetQuestions
  const resetQuestionsForm = useCallback(() => {
    setQuizName('');
    setQuestions([]);
    setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
    setError?.(null);
  }, [setQuizName, setQuestions, setCurrentQuestion, setError])
  
  //================JSX RENDERING======================
  return (
    <div id='newQuizForm'>
      <form id='addQuizForm' method='POST' aria-labelledby='addQuizFormHeading'>
      {/* Screen Reader Heading */}
        <h4 className='visually-hidden' id='addQuizFormHeading'>Add Quiz Form</h4>
         <Stack  id='newQuizStack1'>
      <div id='addQuizHeading'><h3 className='formHeading'>ADD QUIZ</h3></div>
      {/* -----------USERNAME (readonly + hidden)-------------- */}
      <div className="p-2" id='quizUsername' hidden aria-hidden='true'>
      <input
        className='input'
        value={`username: ${currentUser?.username || ''}`}
        id='quizUsername'
        readOnly
        aria-hidden='true'
      />
      </div>
      {/* --------NEW QUIZ NAME------------ */}
      <div  id='newQuizNameBlock'>
        <label className='newQuizLabel' htmlFor='newQuizNameInput'>
          <p className='labelText'>QUIZ NAME:</p>
          <input
          type='text'
            className='addQuizInput'
            id='newQuizNameInput'
            name='newQuizName'
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder='NEW QUIZ NAME'
            required
            autoComplete='off'
            aria-required='true'
            aria-label='New quiz name input'
          />
        </label>
        <Asterisk size={16} color='#990000' aria-hidden='true'/>
      </div>
      {/* --------QUIZ DESCRIPTION------------ */}
      <div id='newQuizDescriptionBlock'>
        <label className='newQuizLabel' htmlFor='newQuizDescriptionInput'>
          <p className='labelText'>DESCRIPTION:</p>
          <input
            type='text'
            className='addQuizInput'
            id='newQuizDescriptionInput'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='QUIZ DESCRIPTION'
            required
            autoComplete='off'
            aria-required='true'
            aria-label='Quiz description input'
          />
        </label>
        <Asterisk size={16} color='#990000' aria-hidden='true'/>
      </div>
      </Stack>
      {/* ===========NEW QUESTIONS========== */}
        <div id='addQuestionDiv' aria-labelledby='newQuestions'>
        {/* Screen reader heading */}
        <p className='visually-hidden' id='newQuestions'>NEW QUESTIONS INPUT</p>
            <Stack gap={3} id='newQuizStack2'>
              <div className="p-2" id='newQuestionHeadingBlock'>
                <h4 className='addQuestionHeading'>ADD QUESTIONS</h4>
              </div>
              {/* --------QUESTION-------------- */}
              <div className="p-2" id='newQuestionBlock'>
                 <label className='newQuizLabel' htmlFor='newQuestionInput'>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    type='text'
                    className='addQuizInput'
                    id='newQuestionInput'
                    placeholder='QUESTION'
                    name='questionText'
                    value={currentQuestion.questionText}
                    onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: e.target.value
                    })
                  }
                    required
                    aria-required='true'
                  />
                 </label>
                 <Asterisk size={16} color='#990000' aria-hidden='true'/>
              </div>
              {/* -------------CORRECT ANSER---------------------- */}
              <div className="p-2" id='newCorrectAnswerBlock'>
                <label className='newQuizLabel' htmlFor='correctAnswerInput'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                  <input
                  type='text'
                    className='addQuizInput'
                    id='correctAnswerInput'
                    name='correctAnswer'
                    onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer:
                        e.target.value
                    })
                   }
                   autoComplete='off'
                   placeholder='CORRECT ANSWER'
                   required
                   aria-required='true'
                   aria-label='Correct answer input'
                  />
                 </label>
                 <Asterisk size={16} color='#990000' aria-hidden='true'/>
              </div>
            </Stack>
            {/* --------ALTERNATIVE ANSWERS------------- */}
            <Stack gap={3} id='newQuizStack3'>
            {/* -----Alternative Answer 1------------ */}
            <div className="p-2" id='altAns1'>
              <label className='newQuizLabel'>
                  <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                  <input
                    type='text'
                    className='addQuizInput'
                    id='altAns1'
                    placeholder='ALTERNATIVE ANSWER 1'
                    name='options[0]'
                    value={currentQuestion.options[0]}
                    onChange={(e) => {
                      const options = [...currentQuestion.options];
                      options[0] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options });
                    }}
                    required
                    aria-required='true'
                    aria-label='alternative answer 1'
                  />
                 </label>
                 <Asterisk size={16} color='#990000' aria-hidden='true'/>
            </div>
            {/* -----Alternative Answer 2------------ */}
            <div className="p-2" id='altAns2'>
               <label className='newQuizLabel' htmlFor='option2'>
                  <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                  <input
                    type='text'
                    className='addQuizInput'
                    id='option2'
                    placeholder='ALTERNATIVE ANSWER 2'
                    value={currentQuestion.options[1]}
                    onChange={(e) => {
                      const options = [...currentQuestion.options];
                      options[1] = e.target.value;
                      setCurrentQuestion({
                        ...currentQuestion,
                        options
                      });
                    }}
                    required
                    autoComplete='off'
                    aria-required='true'
                    aria-label='alternative answer 2'
                  />
                 </label>
                 <Asterisk size={16} color='#990000' aria-hidden='true'/>
            </div>
            {/* -----Alternative Answer 3------------ */}
              <div className="p-2" id='altAns3'>
                <label className='newQuizLabel' htmlFor='option3'>
                    <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                    <input
                    type='text'
                      className='addQuizInput'
                      id='option3'
                      name='options[2]'
                      placeholder='ALTERNATIVE ANSWER 3'
                      value={currentQuestion.options[2]}
                      onChange={(e) => {
                        const options = [...currentQuestion.options];
                        options[2] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options });
                      }}
                      required
                      autoComplete='off'
                      aria-required='true'
                      aria-label='alternative answer 3'
                    />
                  </label>
                  <Asterisk size={16} color='#990000' aria-hidden='true'/>
              </div>
            </Stack>
             <Stack gap={3} id='newQuestionBtnStack'>
      <div className="p-2" id='required'>
         <p className='infoMsg'>
                  <small><Asterisk color='#990000' size={12} /> Indicates required information</small>
        </p>
      </div>
     {/* BUTTONS */}
              <div className="p-2" id='addQuestionBtnBlock'>
                <Button 
                  variant="light"
                  type='button'
                  onClick={handleAddQuestion}
                   id='newQuestionBtn'
                   aria-label='Add question button'
                   >
                  ADD QUESTION
                </Button>
              </div>
              <div className="p-2" id='clearQuestionBtnBlock'>
                <Button
                  type='button'
                  variant="danger"
                  id='clearFormBtn'
                  onClick={resetQuestionsForm}
                  >
                    CLEAR
                </Button>
              </div>
             
              {error && (
                <div className="p-2" id='quizErrorBlock' role='alert' aria-live='polite'>
                  <p id='quizErrorMsg'>{error}</p>
                </div>
              )}
            </Stack>
        </div>
      </form>
      <NewQuestionsList
        addNewQuiz={addQuiz}
        quizName={quizName}
        questions={questions}
        setQuestions={setQuestions}
        setQuizName={setQuizName}
        setErrorMessage={setError}
      />
    </div>
   
  )
}
