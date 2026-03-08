import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function EditUserForm() {
  return (
    <form id='editUserForm' method='PATCH'>
    <div id='formHeadingBlock'>
      <h3 className='formHeading'>EDIT USER FORM</h3>
    </div>
      <div id='editUserDetails'>
       
        <Stack gap={3} id='editUserFormStack'>
      <div className="p-2" id='editUsername'>
        <label>
          <p className='labelText'>USERNAME:</p>
        </label>
        <input
          className='input'
          placeholder='USERNAME'
        />
      </div>
      <div className="p-2" id='fullNameEditBlock'>
      <div id='firstNameEdit'>
<label htmlFor='firstNameEdit'>
          <p className='labelText'>FIRST NAME:</p>
        </label>
        <input
          className='input'
          id='editfirstNameInput'
          placeholder='FIRST NAME'
        />
      </div>
           <div id='lastNameEdit'>
<label>
          <p className='labelText'>LAST NAME:</p>
        </label>
        <input
          className='input'
          id='editLastNameInput'
        />
      </div>
      </div>
      <div className="p-2" id='userEmailEdit'>
        <label htmlFor='editEmailInput'>
          <p className='labelText'>EMAIL:</p>
        </label>
        <input 
          className='input'
          id='editEmailInput'
          type='email'
        />
      </div>
    </Stack>
    
    </div>
    <Stack gap={2} className="col-md-5 mx-auto">
      <Button variant="light" id='editUserBtn'>EDIT USER</Button>
      <Button variant="danger" id='clearFormBtn'>CLEAR FORM</Button>
    </Stack>
      
    </form>
  )
}
