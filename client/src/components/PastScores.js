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
    userScores,
    fetchUserScores,
    loggedIn,
    setSelectedQuiz,
    selectedQuiz
}) {
  //============USE EFFECT HOOK============
    useEffect(() => {
        if (loggedIn === true) {
            fetchUserScores()
        }
    }, [fetchUserScores, loggedIn])

      // Filter the results by the selected quiz name, or show all if none selected
  const quizResults = selectedQuiz && selectedQuiz.trim()
    ? userScores.filter(score => score.quizTitle === selectedQuiz)
    : userScores;

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
      <div className="p-2"> {/* Display quizResults scores */}
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
                        {quizResults.map((score, index) => (
                          <tr key={score._id || index}>
                            <td>{score.quizTitle}</td>
                            <td>{score.score}</td>
                            <td>{new Date(score.attemptDate).toLocaleDateString()}</td>
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
