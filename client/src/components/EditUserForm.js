import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function EditUserForm(
  {//PROPS PASSED FROM PARENT COMPONENT (EditUserData.js)
    currentUser,
    editUserData,
    setEditUserData,
    editUserProfile
  }) {

  const handleUpdate=(e) => {
  const confirmEdit = window.confirm('Are you sure you want to edit user details')
       //Conditional rendering: if user cancels, exit function
       if (!confirmEdit) {
        return// exit function
       }
      e.preventDefault()//Prevent default form submission 
      console.log('[EditUserForm.js]: Edit user account');//Log a message in the console for debugging purposes
      editUserProfile()
  }
 const handleInputChange = (event) => {
  const {name, value} = event.target;

    if (name.startsWith('fullName.')) {
            // Extract the specific field name ('firstName', 'lastName')
            const [, field] = name.split('.');
            // Update the specific key in the 'fullName' object inside newUserData
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
                ...prev,// Spread previous state
                [name]: value// Update targeted field
            }));
        }
 } 
  //Function to clear form
    const clearForm = () => {
        // Confirm before clearing the form
        const confirmClear = window.confirm("Are you sure you want to clear the form?");
        // If user cancels, exit function
        if (!confirmClear) return;

        setEditUserData({ // Reset editUserData state to currentUser values or empty strings
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
    <div id='formHeadingBlock'>
      <h3 className='formHeading'>EDIT USER PROFILE</h3>
    </div>
    {/* EDIT DETAILS */}
      <div id='editUserDetails'>
       {/* Edit Details stack */}
        <Stack gap={3} id='editUserFormStack'>
      <div className="p-2" id='editUsername'>
      {/* ----USERNAME-------- */}
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


        />
      </div>
      {/* =============FULL NAME================== */}
      <div className="p-2" id='fullNameEditBlock'>
      {/* -------------FIRST NAME */}
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
          required
          aria-required='true'

        />
      </div>
      {/* ----------LAST NAME----------- */}
           <div id='lastNameEdit'>
        <label >
          <p className='labelText'>LAST NAME:</p>
        </label>
        <input
          className='input'
          id='editLastNameInput'
          name='fullName.lastName'
          value={editUserData.fullName.lastName}
          onClick={handleInputChange}
          placeholder={currentUser?.fullName?.lastName || 'LAST NAME'}
          required
          autoComplete='family-name'


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
          placeholder={currentUser?.email}
        />
      </div>
    </Stack>
    </div>
      <Stack gap={2} className="col-md-5 mx-auto" id='editUserBtnStack' role='toolbar'>
        <Button variant="light" id='editUserBtn' type='submit'>EDIT USER</Button>
        <Button variant="danger" id='clearFormBtn' type='button' onClick={clearForm}>CLEAR FORM</Button>
      </Stack>   
    </form>
  )
}
