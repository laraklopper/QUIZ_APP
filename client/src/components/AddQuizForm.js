// AddQuizForm.js
import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Asterisk} from 'lucide-react';

export default function AddQuizForm({currentUser}) {
  return (
    <div id='newQuizForm'>
      <form id='addQuizForm' method='POST' aria-labelledby='addQuizFormHeading'>
      {/* Screen Reader Heading */}
        <h4 className='visually-hidden' id='addQuizFormHeading'>Add Quiz Form</h4>
         <Stack gap={3} id='newQuizStack1'>
      <div id='addQuizHeading'><h3 className='formHeading'>ADD QUIZ</h3></div>
      <div className="p-2" id='quizUsername' hidden>
      <input
        className='input'
        value={`username: ${currentUser?.username || ''}`}
        id='quizUsername'
        readOnly
      />
      </div>
      {/* QUIZ NAME */}
      <div className="p-2" id='newQuizNameBlock'>
        <label className='newQuizLabel'>
          <p className='labelText'>QUIZ NAME:</p>
          <input
            className='input'
            id='newQuizNameInput'

          />
          
        </label>
        <Asterisk size={16} color='red' aria-hidden='true'/>
      </div>
      
    </Stack>
        <div id='addQuestionDiv'>
            <Stack gap={3} id='newQuizStack2'>
              <div className="p-2" id='newQuestionHeadingBlock'>
                <h4 className='addQuestionHeading'>ADD QUESTIONS</h4>
              </div>
              <div className="p-2" id='newQuestionBlock'>
                 <label className='newQuizLabel'>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    className='input'
                  />
                 </label>
                 <Asterisk size={16} color='red' aria-hidden='true'/>
              </div>
              <div className="p-2" id='newCorrectAnswerBlock'>
                <label className='newQuizLabel'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                  <input
                    className='input'
                  />
                 </label>
                 <Asterisk size={16} color='red' aria-hidden='true'/>
              </div>
            </Stack>
            <Stack gap={3} id='newQuizStack3'>
            {/* Alternative Answers */}

            <div className="p-2" id='altAns1'>
              <label className='newQuizLabel'>
                  <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                  <input
                    className='input'
                  />
                 </label>
                 <Asterisk size={16} color='red' aria-hidden='true'/>
            </div>
            <div className="p-2" id='altAns2'>
               <label className='newQuizLabel'>
                  <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                  <input
                    className='input'
                  />
                 </label>
                 <Asterisk size={16} color='red' aria-hidden='true'/>
            </div>
            <div className="p-2" id='altAns3'>
               <label className='newQuizLabel'>
                  <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                  <input
                    className='input'
                  />
                 </label>
                 <Asterisk size={16} color='red' aria-hidden='true'/>
            </div>
          </Stack>
            <Stack direction="horizontal" gap={3} id='newQuestionBtnStack'>
              <div className="p-2">
                <p className='infoMsg'><small><Asterisk color='red' size={12} /> Indicates required information</small></p>
              </div>
              <div className="p-2 ms-auto"><Button variant="light" id='newQuestionBtn'>ADD QUESTION</Button></div>
              <div className="p-2"><Button variant="danger" id='clearFormBtn'>CLEAR</Button></div>
            </Stack>
         
        </div>
      </form>
      {/* New Questions List component
      include add Quiz Button
      */}
    </div>
   
  )
}
