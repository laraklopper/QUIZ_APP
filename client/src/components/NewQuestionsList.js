// NewQuestionsList.js
/*NewQuestionsList component: Displays a list of new questions added to the quiz,
allowing users to delete individual questions, clear the quiz form, or submit the new quiz.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, {useCallback} from 'react'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

// NewQuestionsList function component
export default function NewQuestionsList(//Export default NewQuestionsList function component
  {// PROPS PASSED FROM PARENT COMPONENT (AddQuizForm.js)
    addNewQuiz,     // Function to submit the new quiz to the server
    quizName,       // String storing the name of the quiz being created
    questions,      // Array of question objects that have been added so far
    setQuestions,   // Function to update the questions array state
    setQuizName,    // Function to update the quiz name state
    setErrorMessage // Function to set the error message state
  }) {

     //============EVENT LISTENERS===================
  // Function to remove a single question from the list by its index
  const deleteNewQuestion = (index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions)// Update the questions state with the filtered array
  }

  // Function to clear the quiz name, questions list, and any error messages
  const handleClearQuiz = () => {
    setQuizName('');// Clear the quiz name
    setQuestions([]);// Clear the questions list
    setErrorMessage('');// Clear any error messages
  };

  // Function to validate and submit the new quiz
  const handleAddNewQuiz = useCallback(async() => {
    // Validate that a quiz name and at least one question exist before submitting
    if (!quizName || questions.length === 0) {
      setErrorMessage('Please enter a quiz')// Set error message to notify the user
      return;// Exit the function early to prevent an empty quiz being submitted
    }
    await addNewQuiz()// Call the addNewQuiz function passed down from AddQuizForm.js
  },[addNewQuiz, questions.length, quizName, setErrorMessage])

//============JSX RENDERING================

  return (
    <div id='newQuiz'>
     <div id='newQuizOutput'>
        {/* Map over the questions array to render each added question */}
        {questions.map((q, index)=>(
            <Stack gap={3} key={index} id='newQuestionStack'>
                <div className="p-2">
                    {/* Display the question text */}
                    <p className='newQuestionText'>{q.questionText}</p>
                </div>
                <div className="p-2">
                    {/* Display the correct answer */}
                    <p className='newAnswerOutput'>{q.correctAnswer}</p>
                </div>
                <div className="p-2">
                    {/* Display the alternative answer options as a comma-separated string */}
                    <p className='newOptionsOutput'>
                        {Array.isArray(q.options) ? q.options.join(', ') : ''}
                    </p>
                </div>
                <div className="p-2">
                    {/* Button to remove this question from the list */}
                    <Button
                    variant="danger"
                    type='button'
                    id='deleteQuesBtn'
                    onClick={() => deleteNewQuestion(index)}// Pass the current index to identify which question to remove
                    aria-label='Delete question button'>
                    DELETE QUESTION
                    </Button>
                </div>
            </Stack>
        ))}
         <Stack gap={2} className="col-md-5 mx-auto" id='quizOutputBtnStack'>
            {/* Button to clear all quiz fields */}
            <Button variant="danger" id='clearFormBtn' type='button' onClick={handleClearQuiz}>CLEAR</Button>
            {/* Button to submit the completed quiz */}
            <Button variant="light" id='addQuizBtn' type='button' onClick={handleAddNewQuiz}>ADD QUIZ</Button>
        </Stack>
     </div>
   </div>
  )
}
