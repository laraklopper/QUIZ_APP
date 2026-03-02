import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedUserRoute({currentUser, children}) {
  if (!currentUser) {
    return <Navigate/>
  }
  return children
}
