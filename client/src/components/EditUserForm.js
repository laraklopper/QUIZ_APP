// EditUserForm.js
/*EditUserForm component: Displays a form that allows users to edit their profile details,
including username, first name, last name, and email address.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT ICONS FROM LUCIDE-REACT
import { UserRoundPen } from 'lucide-react';

// EditUserForm function component
export default function EditUserForm(//Export default EditUserForm function component
  {//PROPS PASSED FROM PARENT COMPONENT (EditUserData.js)
    currentUser,    // Object containing the currently logged-in user's details
    editUserData,   // Object storing the current values of the edit form fields
    setEditUserData,// Function to update the edit form fields state
    editUserProfile // Function to submit the updated profile to the server
  }) {

    //========EVENT LISTENERS============
  // Function to handle the form submission for editing a user profile
  const handleUpdate = (e) => {
      e.preventDefault()//Prevent default form submission
  const confirmEdit = window.confirm('Are you sure you want to edit user details')// Prompt the user to confirm before editing
       //Conditional rendering: if user cancels, exit function
       if (!confirmEdit) {
        return// Exit the function
       }
      console.log('[EditUserForm.js]: Edit user account');//Log a message in the console for debugging purposes
      editUserProfile()// Call the editUserProfile function passed down from EditUserData.js
  }

  // Function to handle input changes for both flat and nested (fullName) fields
 const handleInputChange = (event) => {
  const {name, value} = event.target;// Destructure name and value from the input event

    if (name.startsWith('fullName.')) {
            // Extract the specific nested field name (e.g. 'firstName' or 'lastName')
            const [, field] = name.split('.');
            // Update only the targeted key within the fullName object, keeping others unchanged
            setEditUserData((prevState) => ({
                ...prevState, // Keep the rest of the state unchanged
                fullName: {
                    ...prevState.fullName,// Keep other fullName fields unchanged
                    [field]: value        // Update the targeted fullName field
                }
            }));
        }
        else {
            // For non-nested fields (like email, username), update directly
            setEditUserData((prev) => ({
                ...prev,// Spread previous state to keep other fields unchanged
                [name]: value// Update the targeted field
            }));
        }
 }

  // Function to reset the form fields back to the current user's existing values
    const clearForm = () => {
        // Prompt the user to confirm before clearing the form
        const confirmClear = window.confirm("Are you sure you want to clear the form?");
        if (!confirmClear) return;// If the user cancels, exit the function

        setEditUserData({// Reset editUserData state to the current user's values or empty strings
            username: currentUser?.username || '',
            fullName: {
                firstName: currentUser.fullName?.firstName || '',
                lastName: currentUser.fullName?.lastName || ''
            },
            email: currentUser?.email || ''
        });
    };

  //==========JSX RENDERING=============
  return (
    <form id='editUserForm' method='PATCH' aria-labelledby='editUserProfileForm' onSubmit={handleUpdate}>
    {/* ---------SCREEN READER HEADING-------- */}
    <p className='visually-hidden' id='editUserProfileForm'>EDIT USER PROFILE</p>
    {/* FORM HEADING */}
    <div id='editUserFormHeadingBlock'>
      <h3 className='formHeading'>EDIT USER PROFILE</h3>
    </div>
    {/* EDIT DETAILS */}
      <div id='editUserDetails'>
       {/* Edit Details stack */}
        <Stack gap={3} id='editUserFormStack'>
        {/* ----USERNAME-------- */}
      <div className="p-2" id='editUsername'>
        <label className='editUserLabel' htmlFor='editUsernameInput'>
          <p className='labelText'>USERNAME:</p>
        </label>
        <input
          className='input'
          id='editUsernameInput'
          placeholder={currentUser?.username || 'USERNAME'}
          name='username'
          value={editUserData.username}
          onChange={handleInputChange}
          autoComplete='username'
          //ARIA ATTRIBUTES
          aria-required='false'
          aria-label='Edit username input'
        />
      </div>
      {/* =============FULL NAME================== */}
      <div className="p-2" id='fullNameEditBlock'>
      {/* -------------FIRST NAME------------- */}
      <div id='firstNameEdit'>
      <label htmlFor='firstNameEdit' className='editUserLabel'>
          <p className='labelText'>FIRST NAME:</p>
        </label>
        <input
          type='text'
          className='input'
          id='editfirstNameInput'
          name='fullName.firstName'
          value={editUserData.fullName.firstName}
          placeholder={currentUser?.fullName?.firstName || 'FIRST NAME'}
          onChange={handleInputChange}
          autoComplete='given-name'
          // ARIA ATTRIBUTES
          aria-required='false'
          aria-label='First name input field'
        />
      </div>
      {/* ----------LAST NAME----------- */}
      <div id='lastNameEdit'>
        <label className='editUserLabel' htmlFor='editLastNameInput'>
          <p className='labelText'>LAST NAME:</p>
        </label>
        <input
          className='input'
          id='editLastNameInput'
          name='fullName.lastName'
          value={editUserData.fullName.lastName}
          onChange={handleInputChange}
          placeholder={currentUser?.fullName?.lastName || 'LAST NAME'}
          autoComplete='family-name'
          // ARIA ATTRIBUTES
          aria-label='Last name input field'
          aria-required='false'  
        />
      </div>
      </div>
      {/* ------------EMAIL----------- */}
      <div className="p-2" id='userEmailEdit'>
        <label htmlFor='editEmailInput'>
          <p className='labelText'>EMAIL:</p>
        </label>
        <input 
          className='input'
          id='editEmailInput'
          type='email'
          name='email'
          value={editUserData.email}
          placeholder={currentUser?.email}
          onChange={handleInputChange}
          autoComplete='email'
          // ARIA ATTRIBUTES
          aria-label='Email input field'
          aria-required='false'
        />
      </div>
    </Stack>
    </div>
      <Stack gap={2} className="col-md-5 mx-auto" id='editUserBtnStack' role='toolbar'>
        {/* Button to submit the updated user profile */}
        <Button
          variant="light"
          id='editUserBtn'
          type='submit'
          role='button'
          aria-label='Button to submit edit user profile form'
          >
          EDIT USER <UserRoundPen aria-hidden='true' forntweight={700}/>
          </Button>
        {/* Button to reset all form fields back to the current user's values */}
        <Button
        variant="danger"
        id='clearFormBtn'
        type='button'
        onClick={clearForm}
        aria-label='Button to clear edit user profile form'
        >
        CLEAR FORM
        </Button>
      </Stack>   
    </form>
  )
}
