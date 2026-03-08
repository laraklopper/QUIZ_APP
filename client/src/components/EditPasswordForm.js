import React, { useCallback, useState } from 'react'
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';// Import the Button component from react-bootstrap
import { Eye, EyeOff, Asterisk } from 'lucide-react';

export default function EditPasswordForm({setError}) {
    // STATE VARIABLES
    // Form variables
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword]

    const [loading, setLoading] = useState(false);// State variable to indicate if the form is submitting
    // Password visibilty variables
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    // Message variables
    const [passwordMsg, setPasswordMsg] = useState(false)

    const resetForm = useCallback(() => {
        
    })
    //=============REQUESTS=========================

    //====================JSX RENDERING====================
  return (
    <form id='editPasswordForm' aria-busy={loading} aria-labelledby='editPasswordForm'>
    {/* Screen Reader Heading */}
    <p className="visually-hidden" id='editPasswordForm'></p>
        <div id='editPswdBlock'>
            <Stack gap={3} id='currentPasswordInputStack' aria-label='password input stack'>
                <div className="p-2">
                    <h3 className='formHeading'>EDIT PASSWORD</h3>
                </div>
                {/* --------CURRENT PASSWORD------------ */}
                <div className="p-2" id='currentPswdBlock'>
                    <label htmlFor='currentPswdInput'>
                        <p className='labelText'>CURRENT PASSWORD:</p>
                    </label>
                    <div className='editPswdInput'>
                        <input
                        className='input'
                        id='currentPswdInput'
                        type={showPassword ? 'text': 'password'}
                        autoComplete='current-password'
                        required
                        disabled={loading}
                        placeholder='CURRENT PASSWORD'
                        onFocus={() => setPasswordMsg(true)}
                        onBlur={() => setPasswordMsg(false)}
                         //ARIA attributes
                        aria-required='true'
                        aria-label="Current password input field"
                    />
                     <p className="inputIcon" aria-hidden="true">
                        <small><Asterisk aria-hidden="true" color="red" size={16} /></small>
                    </p>
                    </div>
                </div>
                <div className="p-2" id='showCurrentPswdBlock'>
                {/* Button to display current password */}
                <Button 
                variant='warning' 
                id='showCurrentPswdBtn'
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                // ARIA ATTRIBUTES
                role='button'
                aria-pressed={showPassword}
                aria-controls='currentPswdInput'
                aria-label={setShowPassword ? 'Hide current password' : 'Show current password'}
                >
                {/* Conditional rendering to show password text */}
                    {showPassword ? (
                    <>
                            Hide Password
                            <EyeOff aria-hidden="true" style={{ marginLeft: 6 }} fontWeight={700} />
                        </>
                    ) : (
                        <>
                            Show Password
                            <Eye aria-hidden="true" style={{ marginLeft: 6 }} fontWeight={700} />
                        </> 
                    )}
                </Button>
                </div>
            </Stack>
            <Stack gap={3} id='newPswdStack' aria-live='polite'>
            {/*-------------NEW PASSWORD----------*/}
                <div className="p-2" id='newPasswordBlock'>
                    <label htmlFor='newPasswordInput'>
                        <p className='labelText'>NEW PASSORD:</p>
                    </label>
                    <div className='editPswdInput'>
                        <input
                        className='input'
                        id='newPasswordInput'
                        type={showNewPassword ? 'text': 'password'}
                        disabled={loading}
                        minLength={8}
                        onFocus={() => setPasswordMsg(true)}// show password help text on focus
                        onBlur={() => setPasswordMsg(false)}// hide password help text on blur
                        //ARIA attributes
                        aria-label="New password Input"
                        aria-required='true'
                    />
                     <p className="inputIcon" aria-hidden="true">
                        <small><Asterisk aria-hidden="true" color="red" size={16} /></small>
                    </p>
                    </div>
                    
                </div>
                <div className="p-2" id='showNewPswdBlock'>
                    <Button 
                    variant='warning' 
                    type='button' 
                    id='showNewPswdBtn'
                    onClick={() => setShowNewPassword(prev => !prev)}
                    // ARIA attributes
                    role='button'
                    aria-pressed={showNewPassword}
                    aria-controls='password'
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                        SHOW PASSORD
                    </Button>
                </div>          
                {/* Password Message */}
                {passwordMsg && (
                    <div
                        className="p-2"
                        id="passwordHelpText"
                        // aria attributes
                        role="alert"
                        aria-live="polite"
                    >
                        <h6 className="msgText" aria-label='Password Message Text'>
                            We will never share your password
                        </h6>
                    </div>
                )}
            </Stack>
        </div>
            <Stack gap={2} className="col-md-5 mx-auto" id='submitPswdChangeBlock'>
                <Button 
                variant="danger" 
                id='clearFormBtn'
                type='button'
                >CLEAR FORM</Button>
                {/* ----------SUBMIT CHANGE PASWORD BUTTON -----*/}
                <Button 
                variant="light" 
                id='editPswdBtn' 
                type='submit'
                 // ARIA attributes
                role='button'   
                aria-label='button to submit new password form'
                >
                {loading ? 'Saving…' : 'Save changes'}
                </Button>
            </Stack>
  
        
    </form>
  )
}
