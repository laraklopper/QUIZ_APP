//NewQuestionsList.js
// Import necessary modules and packages
import React, {useCallback} from 'react'
//Bootstrap
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

//NewQuestionsList function component
export default function NewQuestionsList(//Export default NewQuestionsList function component
  {// PROPS PASSED FROM PARENT COMPONENT (AddQuizForm.js)
    addNewQuiz, 
    quizName, 
    questions, 
    setQuestions, 
    setQuizName, 
    setErrorMessage
  }) {

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
    // Function to handle form submission
  const handleAddNewQuiz = useCallback(async() => {
    /*Conditional rendering to check if the quiz name is
    provided and if there is at least one question*/
    if (!quizName || questions.length === 0) {
      setErrorMessage('Please enter a quiz')// Set error message to notify the user
      return;//Exit the function
    }
    await addNewQuiz()//Call the addNewQuiz component
  },[addNewQuiz, questions.length, quizName, setErrorMessage])

//============================
  return (
    <div id='newQuiz'>
     <div id='newQuizOutput'>
        {questions.map((q, index)=>(
            <Stack gap={3} key={index} id='newQuestionStack'>
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
                    <Button 
                    variant="danger" 
                    type='button' 
                    id='deleteQuesBtn' 
                    onClick={() => deleteNewQuestion(index)}
                    aria-label='Delete question button'>
                    DELETE QUESTION
                    </Button>
                </div>
            </Stack>
        ))}
         <Stack gap={2} className="col-md-5 mx-auto" id='quizOutputBtnStack'>
            
            <Button variant="danger" id='clearFormBtn' type='button' onClick={handleClearQuiz}>CLEAR</Button>
            <Button variant="light" id='addQuizBtn' type='button' onClick={handleAddNewQuiz}>ADD QUIZ</Button>
        </Stack>
     </div>
   </div>
  )
}
