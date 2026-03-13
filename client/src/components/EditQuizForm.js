import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import '../css/componentCSS/QuizData.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';
export default function EditQuizForm({editQuiz}) {

    /* dont allow username edit*/
    //=========JSX RENDERING================
  return (
    <form id='editQuizForm' aria-labelledby='editQuizData'>
        {/* -----Screen Reader Heading-------- */}
        <p className='visually-hidden' id='editQuizData'>EDIT QUIZ FORM</p>
              <Stack gap={3}>
                <div className="p-2"><h3 className='formHeading'>EDIT QUIZ</h3></div>
                
                <div className="p-2" id='editQuizStatus'>
                {/* ERROR MESSAGE */}
                    <div className='error-message'></div>
                    {/* Success Message */}
                    <div></div>
                </div>
                <div className="p-2" id='editCreatedByBlock'>
                    {/* CREATED BY */}
                    <h6 className='formText'>CREATED BY:{/*FULL NAME*/}</h6>
                </div>
             </Stack>
                 <div id='editQuizDetails'>
                    <Stack gap={3} id='editQuizStack1'>
                    
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
        <div id='editQuizBtnBlock'>
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack2'>
                <Button variant="light" type='submit'>Save changes</Button>
                <Button variant="danger" type='button'>Cancel</Button>
            </Stack>
        </div>        
    </form>
  )
}
