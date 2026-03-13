import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import '../css/componentCSS/QuizData.css'
import Stack from 'react-bootstrap/Stack';

export default function EditQuizForm() {

    //=========JSX RENDERING================
  return (
    <form>
        <div id='editQuizDetails'>
                <Stack gap={3}>
      <div className="p-2">First item</div>
      <div className="p-2">Second item</div>
      <div className="p-2">Third item</div>
    </Stack>


        </div>
    </form>
  )
}
