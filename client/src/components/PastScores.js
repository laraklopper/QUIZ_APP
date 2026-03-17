// PastScores.js
/*PastScores component: Displays a table of the user's past quiz scores, with a dropdown
to filter results by quiz name and a total attempts count per quiz.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useEffect } from 'react';
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/Scores.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import FormSelect from 'react-bootstrap/FormSelect';

//PastScores function component
export default function PastScores(//Export default PastScores function component
  {//PROPS PASSED FROM PARENT COMPONENT (GAME.js)
    userScores,     // Array of the current user's past quiz score objects
    fetchUserScores,// Function to fetch the current user's scores from the server
    loggedIn,       // Boolean indicating whether the user is logged in
    setSelectedQuiz,// Function to update the selected quiz filter state
    selectedQuiz    // String storing the currently selected quiz name for filtering
}) {
  //============USE EFFECT HOOK============
  // Fetch the user's scores when the component mounts or when loggedIn changes
    useEffect(() => {
      /* Conditional rendering to check if user 
      is loggedIn before fetching scores*/ 
        if (loggedIn === true) {
            fetchUserScores()// Only fetch scores if the user is logged in
        }
    }, [fetchUserScores, loggedIn])

  // Filter scores by the selected quiz name; show all scores if no quiz is selected
  const quizResults = selectedQuiz && selectedQuiz.trim()
    ? userScores.filter(score => score.quizTitle === selectedQuiz)// Return only scores matching the selected quiz
    : userScores;// Return all scores if no filter is applied

    // ===================JSX RENDERING=====================
  return (
     <div id="pastScoresOutput">
              {/* Conditional rendering to check if the user has any scores */}
              {userScores.length > 0 ? (
                <div id='pastScoresDisplay'>
                  <Stack gap={3} id='scoresStack'>
                   <div className="p-2" id='scoresHeadingBlock'>
                    <h2 id='scoresHeading'>USER SCORES</h2>
                   </div>
                  <div id='selectScoresBlock'>
                  <div id='selectScoresForm'>

                  
                   {/* Select dropdown form for quiz selection */}
                  <FormSelect
                    title={selectedQuiz || 'SELECT'}
                    aria-label="Select a Quiz"
                    value={selectedQuiz || ''}//The value of the selected quiz
                    onChange={(e) => setSelectedQuiz(e.target.value)}// Handle quiz selection
                    id='scoreList'
                  >
                    {/* Default option — shows all scores */}
                    <option value="" className='scoresOption'>ALL SCORES</option>
                    {/* Map through the user scores and display 
                    them in the select dropdown */}
                    {userScores.map((score, index) => (
                      <option key={score._id || index} value={score.quizTitle}>
                        {score.quizTitle}
                      </option>
                    ))}
                  </FormSelect>
                  </div>
      </div>
      <div className="p-2">
                  {/* Display the filtered scores table, or a message if no results match */}
                  {quizResults.length > 0 ? (
                    <table id='scoresTable'>
                      <thead>
                        <tr>
                          <th>QUIZ NAME</th>
                          <th>SCORE</th>
                          <th>DATE</th>
                          <th>TOTAL ATTEMPTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map over the filtered scores to render a row for each result */}
                        {quizResults.map((score, index) => (
                          <tr key={score._id || index}>
                            <td>{score.quizTitle}</td>
                            <td>{score.score}</td>
                            <td>{new Date(score.attemptDate).toLocaleDateString()}</td>{/* Format the attempt date for display */}
                            <td>{score.attempts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="scoreError">NO SCORES FOR THIS QUIZ</p>
                  )}
                  </div>
     
                  </Stack>   
              </div>
              ) : (
                // Message if no scores are found               
                <p className="scoreError">NO SCORES AVAILABLE</p>
              )}
            </div>
  )
}
