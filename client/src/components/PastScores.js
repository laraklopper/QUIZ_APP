//PastScores.js
import React, { useEffect } from 'react';
// CSS STYLESHEETS
import '../css/componentCSS/Scores.css'
// Animations CSS
import '../css/componentCSS/ComponentAnimations.css'
// Bootstrap
import Stack from 'react-bootstrap/Stack';
import FormSelect from 'react-bootstrap/FormSelect'; //Import Formselect component from react-bootstrap

export default function PastScores(
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

      // Filter the results by the selected quiz name
  const quizResults = selectedQuiz
    // Filter the scores based on the selected quiz
    ? userScores.filter(score => score.quizTitle === selectedQuiz)
    : [];//If no quiz is selected return an empty array

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
                    {/* Default option */}
                    <option value=" " className='scoresOption'>SELECT SCORES</option>
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
      <div className="p-2"> {/* Display quizResults scores for the selected quiz */}
                  {selectedQuiz && quizResults.length > 0 ? (
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
                    //Message if no scores are available for the specific quiz
                    selectedQuiz && <p className="scoreError"></p>
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
