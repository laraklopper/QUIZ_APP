// SelectQuizForm.js
/*SelectQuizForm component: Displays a dropdown form that allows the user to select a quiz
from the available quiz list before starting the game.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

// SelectQuizForm function component
export default function SelectQuizForm(//Export default SelectQuizForm function component
    {//PROPS PASSED FROM PARENT COMPONENT (Game.js)
        selectedQuizId,   // String storing the ID of the currently selected quiz
        setSelectedQuizId,// Function to update the selected quiz ID state
        quizList          // Array of all available quiz objects
    }) {

     //============EVENT LISTENERS===============
    // Function to update the selected quiz ID when the user picks a quiz from the dropdown
    const handleSelect = (event) => {
        setSelectedQuizId(event.target.value)// Set the selected quiz ID from the dropdown value
    }

    //==============JSX RENDERING==================
  return (
        <Stack  id='selectQuiz'>
            <div className="p-2" id='selectFormHeading'>
                <h3 className='formHeading'>SELECT QUIZ</h3>
            </div>
            <div id='selectQuizLabelBlock'>
                  {/* Label for the quizList dropdown */}
            <label id='selectQuizLabel'>
                <p className='labelText'>SELECT QUIZ BELOW</p>
            </label>
            </div>
            <div id='selectQuizBlock'> 
          
            {/* ------SCREEN READER HEADING---------- */}
            <p id='selectQuizFormHeading' className='visually-hidden'>SELECT QUIZ FORM</p>
            <Form.Select
                value={selectedQuizId}
                id='selectQuizForm'
                onChange={handleSelect}
                aria-labelledby="selectQuizFormHeading"
                >
            {/* Default option prompting
            the user to select a quiz */}
                <option id='selectQuizOption' value={''}>SELECT A QUIZ</option>
                {/* Map over the quizList array to create an option for each quiz */}
                {quizList && quizList.length > 0 && quizList.map ((quiz) => (
                    <option
                        key={quiz._id}
                        value={quiz._id}
                        className='input'
                        id='quizOptions'>
                        {/* Display quiz title */}
                        {quiz.title}
                    </option>
                ))}
                </Form.Select>
            </div>           
        </Stack>
 
  )
}
