// Results.js
import React, { useCallback, useState } from 'react'

export default function Results(
  {
    currentScore,
    quizName,
    totalQuestions,
    currentUser,
    addScore
  }) {
    const [showScore, setShowScore] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [submissionError, setSubmissionError] = useState(null);

    const handleSubmitScore = useCallback(async (e) => {
      e.preventDefault()
      setSubmitted(true)
      setSubmissionError(null)
      try {
        await addScore()
        console.log(currentScore);
        setShowScore(false)
      } catch (error) {
        setSubmissionError('Failed to save score');
        console.error('[ERROR: Results.js, handleSubmitScore]: Failed to save score', error.message);
      }finally{
        setSubmitted(false);
      }
    },[addScore, currentScore])
    //=================================
    
  return (
    <div>Results</div>
  )
}
