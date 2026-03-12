import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import Form from 'react-bootstrap/Form';

export default function SelectQuizForm() {

     //============EVENT LISTENERS===============
    // Function to handle quiz selection

    //==============JSX RENDERING==================
  return (
    <div id='selectQuiz'>
       <div id='selectFormHeading'>
         <h3 className='formHeading'>SELECT QUIZ</h3>
       </div>
       <Form.Select id='selectQuizForm' aria-labelledby="selectQuizFormHeading">
       {/* ------SCREEN READER HEADING---------- */}
       <p id='selectQuizFormHeading' className='visually-hidden'>SELECT QUIZ FORM</p>
       {/* Default option prompting 
       the user to select a quiz */}
         <option className='selectQuizOption'>SELECT A QUIZ</option>
        {/* Map over the quizList array to create an option for each quiz */}
            <option value=" " className='input' id='selectQuiz option'>
                {/* Display quiz name */}
            </option>
    </Form.Select>
    </div>
  )
}
