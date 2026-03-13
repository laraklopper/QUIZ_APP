import React, { useState } from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import '../css/componentCSS/QuizData.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';
export default function EditQuizForm({editQuiz, error}) {
    //=====STATE VARIABLES=================
    const [currentQuestionIndex, setCurrentQuestionIndex] =useState(0)
    const [successMessage, setSuccessMessage] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(false)

    const handleEdit = (e) => {
        const confirmEdit = window.confirm('Are you sure you want to edit quiz')
        if (!confirmEdit) {
            return;
        }
        e.preventDefault()
        console.log('[EditQuizForm.js]: Edit quiz')
        editQuiz()
    }
    /* dont allow username edit*/
    //=========JSX RENDERING================
  return (
    <form id='editQuizForm' onSubmit={handleEdit} aria-labelledby='editQuizData'>
        {/* -----Screen Reader Heading-------- */}
        <p className='visually-hidden' id='editQuizData'>EDIT QUIZ FORM</p>
              <Stack gap={3} id='editQuizStack1'>
                <div className="p-2">
                    <h3 className='formHeading'>EDIT QUIZ</h3>
                </div>
                <div id='editQuizStatus'>
                    {/* Error Message */}
                     {error && <div className='error-message'>{error}</div> }
                    {/* Success Message */}
                    {successMessage && <div className='success-message'>{successMessage}</div> }
                    
                </div>
                <div className="p-2" id='editCreatedByBlock'>
                    {/* CREATED BY */}
                    <h6 className='formText'>CREATED BY:{/*FULL NAME*/}</h6>
                </div>
             </Stack>
                 <div id='editQuizDetails'>
                    <Stack gap={3} id='editQuizStack2'>
                    
                    {/* TITLE:QuizName */}
                    <div className="p-2">
                        <label>
                            <p className='labelText'>QUIZ NAME:</p>
                        </label>
                        <input
                            className='input'
                            
                        />
                    </div>
                    {/* QUIZ DESCRIPTION */}
                    <div className="p-2">
                         <label>
                            <p className='labelText'></p>
                        </label>
                    </div>
                    {/* Questions */}
                    <div id='editQuestionsBlock'>
                        <label>
                            <p className='labelText'></p>
                        </label>
                        <div id='editQuizNavBtns'>
                            <Button size='sm' ><ArrowBigLeftDash fontWeight={700} /></Button>
                            <Button size='sm'><ArrowBigRightDash fontWeight={700}/></Button>
                        </div>

                    </div>
                </Stack>
        </div>
        
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack3'>
                <Button variant="light" type='submit' id='editQuizBtn'>EDIT QUIZ</Button>
                <Button variant="danger" type='button' id='clearFormBtn'>CLEAR</Button>
            </Stack>
             
    </form>
  )
}
