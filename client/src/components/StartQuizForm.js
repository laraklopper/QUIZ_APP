import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/QuizForms.css'
import Stack from 'react-bootstrap/Stack';
// import Button from 'react-bootstrap/Button';


export default function StartQuizForm(
  {
    timer, 
    quiz, 
    quizTimer, 
    setQuizTimer, 
    quizStarted, 
    handleQuizStart}) {
  return (
    <form>
         <Stack gap={3}>
          <div className="p-2"></div>
          <div className="p-2">Second item</div>
          <div className="p-2">Third item</div>
         </Stack>
    </form>
  )
}
