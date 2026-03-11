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

    //========EVENT LISTENENRS============
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
  // 
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
          onClick={handleInputChange}
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
          onClick={handleInputChange}
          autoComplete='email'
          // ARIA ATTRIBUTES
          aria-label='Email input field'
          aria-required='false'
        />
      </div>
    </Stack>
    </div>
      <Stack gap={2} className="col-md-5 mx-auto" id='editUserBtnStack' role='toolbar'>
        <Button 
          variant="light" 
          id='editUserBtn' 
          type='submit' 
          aria-label='Button to submit edit user profile form'
          >
          EDIT USER
          </Button>
        <Button variant="danger" id='clearFormBtn' type='button' onClick={clearForm} aria-label='Button to clear edit user profile form'>CLEAR FORM</Button>
      </Stack>   
    </form>
  )
}
