import React from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';// Import the Button component from react-bootstrap

export default function EditPasswordForm() {
    // STATE VARIABLES
    // Form variables
    // Password visibilty variables
    // Message variables
  return (
    <form id='editPasswordForm' aria-labelledby='editPasswordForm'>
    {/* Screen Reader Heading */}
    <p className="visually-hidden" id='editPasswordForm'></p>
        <div id='editPswdBlock'>
            <Stack gap={3} id='newPasswordInputStack' aria-label='password input stack'>
                <div className="p-2">
                    <h3 id='formHeading'>EDIT PASSWORD</h3>
                </div>
                <div className="p-2" id='currentPswdBlock'>
                    <label htmlFor='currentPswdInput'>
                        <p className='labelText'>CURRENT PASSWORD</p>
                    </label>
                    <input
                        className='input'
                        id='currentPswdInput'
                    />
                </div>
                <div className="p-2" id='showCurrentPswdBlock'><Button variant='warning' id='showCurrentPswdBtn'></Button></div>
            </Stack>
            <Stack gap={3}>
            {/* New Password */}
                <div className="p-2">
                    <label>
                        <p className='labelText'>NEW PASSORD</p>
                    </label>
                    <input
                        className='input'
                    />
                </div>
                <div className="p-2">
                    <Button variant='warning' type='button' id='showNewPswdBtn'>
                        SHOW PASSORD
                    </Button>
                </div>
                
                <div className="p-2">
                    {/* Password Msg */}
                </div>
            </Stack>
        </div>
            <Stack gap={2} className="col-md-5 mx-auto" id='submitPswdChangeBlock'>
                <Button variant="danger">CLEAR FORM</Button>
                <Button variant="light" id='editPswdBtn' type='submit'>EDIT PASSWORD</Button>
            </Stack>
        <Stack gap={3}>
                <div id='submitPswdChangeBlock'>
                    <Button id='editPswdBtn' type='submit'></Button>
                </div>
      <div className="p-2">
        {/*  */}
      </div>
      <div className="p-2">Third item</div>
    </Stack>
        
    </form>
  )
}
