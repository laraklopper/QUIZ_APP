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
        <p className='visually-hidden' id='editQuizData'>EDIT QUIZ</p>
        {/*  */}
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
                 <Stack gap={3} id='editQuizStack2'>
                    <div className="p-2">First item</div>
                    <div className="p-2">Second item</div>
                    <div className="p-2">Third item</div>
                </Stack>
        </div>
        <div id='editQuizBtnBlock'>
            <Stack gap={2} className="col-md-5 mx-auto" id='editQuizStack3'>
                <Button variant="secondary">Save changes</Button>
                <Button variant="outline-secondary">Cancel</Button>
            </Stack>
        </div>      
    </form>
  )
}
