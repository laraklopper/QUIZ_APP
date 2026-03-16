// ProtectedAdminRoute.js
import React from 'react'
// Import React Router components
import { Navigate } from 'react-router-dom'

/**
 This component protects routes that require ADMIN access.
  Props:
  - currentUser: the authenticated user object
   - children: the admin-only component(s) to render
   Pages: 
   => Home.js, 
   => Game.js, 
   => AddQuiz.js, 
   => Users.js
 */
export default function ProtectedAdminRoute({currentUser, children}) {
    // Conditional rendering to Block access if:
    // 1. No user is logged in
    // 2. User exists but is NOT an admin
  if (!currentUser || !currentUser.admin) {
    return <Navigate to="/" />
  }
      // User is logged in AND is an admin,
    // allow access to the admin-only content
  return children
}
