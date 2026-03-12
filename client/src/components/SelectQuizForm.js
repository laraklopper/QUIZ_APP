import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

export default function SelectQuizForm(
    {
        selectedQuizId, 
        setSelectedQuizId, 
        quizList
    }) {


     //============EVENT LISTENERS===============
    // Function to handle quiz selection
    const handleSelect = (event) => {
        setSelectedQuizId(event.target.value)
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
          
            <Form.Select
                value={selectedQuizId}
                id='selectQuizForm' 
                onChange={handleSelect}
                aria-labelledby="selectQuizFormHeading"
                >
            {/* ------SCREEN READER HEADING---------- */}
            <p id='selectQuizFormHeading' className='visually-hidden'>SELECT QUIZ FORM</p>
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
                        {/* Display quiz name */}
                        {quiz.name}
                    </option>
                ))}   
                </Form.Select>
            </div>
            
        </Stack>
 
  )
}
