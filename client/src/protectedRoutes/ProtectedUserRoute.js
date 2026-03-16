// ProtectedUserRoute.js
import React from 'react';// Import the React module to use React functionalities
// React Router components
import { Navigate } from 'react-router-dom'
/**
This component protects routes that require a logged-in user.
  Props:
  - currentUser: the authenticated user object (null if not logged in)
  - children: the protected component(s) to render
   Pages: 
   => Home.js, 
   => Game.js, 
   => AddQuiz.js, 
 */
export default function ProtectedUserRoute({currentUser, children}) {
    // Conditional rendering: 
    /* If there is NO logged-in user, redirect 
    the user away from the protected route*/
  if (!currentUser) {
    return <Navigate to="/" />
  } 
   // If the user IS logged in,
  // allow access to the protected content
  return children
}
