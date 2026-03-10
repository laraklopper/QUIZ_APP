import React from 'react'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function NewQuestionsList({questions, setQuestions, setQuizName, setErrorMessage}) {

     //============EVENT LISTENERS===================
  // Function to delete a question new questuion
  const deleteNewQuestion = (index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions) // Update the questions state with the new array
  }

  // Function to clear the quiz form (name, questions, and error message)
  const handleClearQuiz = () => {
    setQuizName('');// Clear the quiz name
    setQuestions([]);// Clear the questions list
    setErrorMessage('');// Clear any error messages
  };
//============================
  return (
    <div id='newQuiz'>
     <div id='newQuizOutput'>
        <Stack gap={3}>
        <div className="p-2">First item</div>
        <div className="p-2">Second item</div>
        <div className="p-2">Third item</div>
        </Stack>
        {questions.map((q, index)=>(
            <Stack gap={3} key={index}>
                <div className="p-2">
                    {/* Display the question text*/}
                    <p className='newQuestionText'>{q.questionText}</p>
                </div>
                <div className="p-2">
                    {/* Display the correct answer  */}
                    <p className='newAnswerOutput'>{q.correctAnswer}</p>
                </div>
                <div className="p-2"> 
                  {/* Options for the new quiz*/}
                    <p className='newOptionsOutput'>
                        {Array.isArray(q.options) ? q.options.join(', ') : ''}
                    </p>
                </div>
                <div className="p-2">
                    <Button variant="danger" type='button' id='deleteQuesBtn' onClick={deleteNewQuestion}>DELETE QUESTION</Button>
                </div>
            </Stack>
        ))}
         <Stack gap={2} className="col-md-5 mx-auto">
            
            <Button variant="danger" id='clearFormBtn' type='button' onClick={handleClearQuiz}>CLEAR</Button>
            <Button variant="light" id='addQuizBtn'>ADD QUIZ</Button>
        </Stack>
     </div>
   </div>
  )
}
