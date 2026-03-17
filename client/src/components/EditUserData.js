// EditUserData.js
/*EditUserData component: Displays the current user's account details and provides
toggle buttons to show or hide forms for editing the account profile or password.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/UserData.css'
import '../css/componentCSS/Data.css';
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT UTILITY FUNCTIONS
import {dateDisplay} from '../utilFunctions/dateFunctions'
// IMPORT CUSTOM COMPONENTS
import EditPasswordForm from './EditPasswordForm';
import EditUserForm from './EditUserForm';

/*EditUserData function component*/
export default function EditUserData(//Export default EditUserData function component
  {//PROPS PASSED FROM PARENT COMPONENT (Home.js)
    currentUser, 
    setError
  }
  ) {
    //==============STATE VARIABLES===========
  const [editUserData, setEditUserDate]= useState({
    username: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
    email: ''
  })
  const [activeForm, setActiveForm] = useState('null')
 // State to manage whether the user is in edit mode
  // Convenience booleans for conditional rendering + ARIA states
  const showAccountForm = activeForm === 'account'
  const showPasswordForm = activeForm === 'password'

    const username = currentUser?.username || 'Username Not provided'//User username
    const firstName = currentUser?.fullName?.firstName || 'First name not provided';//User First name
    const lastName = currentUser?.fullName?.lastName || 'Last name not provided';//User Last 
    const email = currentUser?.email || 'No email provided';//User Email
    const dateOfBirth = currentUser?.dateOfBirth || 'No date provided';//User Date of Birth
    const isAdmin = currentUser?.admin ? 'Yes' : 'No';//User Admin Status

    //============REQUESTS========================
    //-------PATCH-----------------
    //EditUserProfile
    const editUserProfile = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User is not authenticated. Please log in again.");
        const userId = currentUser?._id || localStorage.getItem('userId');
        if (!userId) throw new Error('No user id available');
        const response = await fetch(`http://localhost:3001/users/editUser/${userId}`, {
        method: 'PATCH',//HTTP Request method
        mode: 'cors',//Enable CORS for Cross-Origin-Resource Sharing
        headers: {
          'Content-Type': 'application/json', //Specify the Content-Type as JSON
          'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
        },
        body: JSON.stringify(editUserData), // Send updated user data
      });
      /* Conditional rendering to check if the response
          is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        // Handle status-specific errors first (gives user better feedback)
        if (response.status === 401) throw new Error('Unauthorized. Please login again.');
        if (response.status === 403) throw new Error('Forbidden. You cannot edit this account.');
        if (response.status === 409) throw new Error('Email or contact number already in use.');
        // Try to read backend message for other error cases
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update user account');//Throw an error message if PUT request is unsuccessful
      }

      const data = await response.json();// Parse the JSON data from the response body
      const updated = data.updatedUser;

      setEditUserDate(updated);// Update currentUser in App state (this refreshes the UI everywhere)

      // Re-sync edit form with saved values (keep shape!)
      setEditUserDate({
        username: updated.username || '',
        fullName: { ...updated.fullName },
        companyName: updated.companyName || '',
        email: updated.email || '',
       
      });
      } catch (error) {
         console.error(`[ERROR: EditUserData.js]: Error updating account ${error.message}`);
          setError(error.message || 'Error updating account. Please try again.');// Set the error state to display the error in the UI
        alert(`Error updating account`)//Notify user if there is an error
      }
    },[setEditUserDate, editUserData, setError, currentUser?._id])
    //=============EVENT HANDLERS=================
// If the same form is already open, close it; otherwise open it.
  // Toggle account form
  const toggleAccountForm = useCallback(() => {
      setActiveForm(prevForm => (prevForm === 'account' ? null : 'account'));
    }, []);
    // Toggle password form
    const togglePasswordForm = useCallback(() => {
      setActiveForm(prevForm => (prevForm === 'password' ? null : 'password'));
    },[])
    //================JSX RENDERING==============
  return (
    <div id='userDetails'>
      <div id='userDetailsDiv' aria-labelledby="userDetailsHeading">
        {/* Screen-reader-only heading for userDetails */}
          <h2 id="userDetailsHeading" className="visually-hidden">
            User account details
          </h2>
          <Row id='userDetailsRow1'>
            <Col xs={6} md={4} id='userDetailsCol1'>
              {/* Username */}
              <span className='userDetailsLabel'>
                  <h5 className='dataTextHead'>USERNAME:</h5>
                  <h5 id='usernameDataText'>{username}</h5>
              </span>
            </Col>
            <Col xs={12} md={8} id='userdetailsCol2'>
                {/* User Full Name */}
                <span className='userDetailsLabel'>
                    <h5 className='dataTextHead'>NAME:</h5>
                    <h5 className='currentUserFullName'>{`${firstName} ${lastName}`} </h5>
                </span>
            </Col>
          </Row>
          <Row id='userDetailsRow2'>
            <Col xs={6} md={4} id='userDetailsCol3'>
                  <span className='userDetailsLabel'>
                        <h5 className='dataTextHead'>EMAIL: </h5>
                        <h5 className='emailData'>{email}</h5>
                    </span>
            </Col>
            <Col xs={6} md={4} id='userDetailsCol4'>
                  <span className='userDetailsLabel'>
                    <h5 className='dataTextHead'>DATE OF BIRTH: </h5>
                    <h5 className='dataText'>{dateDisplay(dateOfBirth)}</h5>
                </span>
            </Col>
            <Col xs={6} md={4} id='userDetailsCol5'>
              {/* User admin status*/}
                <span className='userDetailsLabel'>
                    <h5 className='dataTextHead'>ADMIN: </h5>
                    <h5 id='adminDataText'>{isAdmin}</h5>
                </span>
            </Col>
            
          </Row>      
        
      </div>
        {/* Edit User details */}
        <Row id='toggleEditUserRow'>
          <Col id='editUserCol'>
             <Stack gap={2} className="col-md-5 mx-auto" id='editUserBtnStack'>
                <div  id='edit-user-details'>
                 <p className='btnText'>CLICK HERE TO:</p>
                        {/* TOGGLE BUTTON TO EDIT USER DETAILS */}
                          <Button 
                          variant="warning" 
                          id='toggleEditAccountBtn'
                          type='button'
                          onClick={toggleAccountForm}
                          // ARIA ATTRIBUTES
                          role='button'
                          aria-label='Button to toggle Edit user Form'
                          aria-pressed={showAccountForm}
                          aria-expanded={showAccountForm}
                          aria-controls='edit-user-panal'
                          >
                          {showAccountForm ? 'EXIT': 'EDIT ACCOUNT'}
                        </Button>
                  </div>
                   <div id='edit-user-password'>
                        <p className='btnText'>CLICK HERE TO:</p>
                        {/* TOGGLE BUTTON TO EDIT PASSWORD DETAILS */}
                        <Button 
                          variant="warning" 
                          id='toggleEditPswdBtn'
                          type='button'
                          onClick={togglePasswordForm}
                          // ARIA-ATTRIBUTES
                          role='button'
                          aria-pressed={showPasswordForm}
                          aria-expanded={showPasswordForm}
                          aria-controls='edit-password-panal' 
                          aria-label='Button to toggle Edit user Form'
                          >
                            {showPasswordForm ? 'EXIT' : 'EDIT PASSWORD'}
                        </Button>
                    </div>
            </Stack>
            {/* EDIT USER STACK: CONDITIONAL */}
            {/* Only render this stack if a form is active */}
            {activeForm && (
              <div id='editUserForms'>
              <Stack  id='editUserStack'>
                  <div id='editUserBlock'>
                    {/* Edit userdataForm */}
                      {showAccountForm &&(
                        <div
                        id='edit-user-panal'
                        role='region'
                        aria-labelledby='editAccountHeading'
                        >
                          {/* Screen Reader Heading */}
                            <h3 id="editAccountHeading" className="visually-hidden">Edit account details</h3>
                            {/* Render the EditUserForm component */}
                            <EditUserForm
                              editUserData={editUserData}
                              setEditUserData={setEditUserDate}
                              editUserProfile={editUserProfile}
                              currentUser={currentUser}
                            />
                        </div>
                      )}
                  </div>
                  <div id='editPasswordBlock'>
                    {/* Toggle Edit passwordForm. */}
                    {showPasswordForm && (
                      <div id='edit-password-panal' role='region' aria-labelledby='editPasswordHeading'>
                       {/* Screen Reader Heading */}
                            <h3 id="editPasswordHeading" className="visually-hidden">Edit Password details</h3>
                      {/* Render the EditPasswordForm component */}
                        <EditPasswordForm
                          setError={setError}
                        />
                    </div>
                    )}
                  </div>
              </Stack>
              </div>
            )}
               
          </Col>
        </Row>
    </div>
  )
}
