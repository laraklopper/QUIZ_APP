import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import '../css/componentCSS/QuizData.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function EditQuizForm() {

    /* dont allow username edit*/
    //=========JSX RENDERING================
  return (
    <form id='editQuizForm' aria-labelledby='editQuizData'>
        {/* -----Screen Reader Heading-------- */}
        <p className='visually-hidden' id='editQuizData'>EDIT QUIZ FORM</p>
          <div>
            <h3 className='formHeading'>EDIT QUIZ</h3>
          </div>
        <div id='editQuizDetails'>
                <Stack gap={3} id='editQuizStack1'>
                    
                    {/* TITLE:QuizName */}
                    <div className="p-2">
                        <label>
                            <p className='labelText'></p>
                        </label>
                    </div>
                    {/* QUIZ DESCRIPTION */}
                    <div className="p-2">
                         <label>
                            <p className='labelText'></p>
                        </label>
                    </div>
                    {/* Questions */}
                    <div className="p-2">
                        <label>
                            <p className='labelText'></p>
                        </label>

                    </div>
                </Stack>
        </div>
        <div id='editQuizBtnBlock'>
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack2'>
                <Button variant="secondary">Save changes</Button>
                <Button variant="outline-secondary">Cancel</Button>
            </Stack>
        </div>    
      
    </form>
  )
}
