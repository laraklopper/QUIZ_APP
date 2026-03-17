// EditPasswordForm.js
/*EditPasswordForm component: Displays a form that allows users to update their password,
including fields for the current and new password with visibility toggles and strength validation.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useCallback, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/FormSetup.css'
import '../css/componentCSS/EditUserForms.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT ICONS FROM LUCIDE-REACT
import { Eye, EyeOff, Asterisk, UserKey } from 'lucide-react';

// EditPasswordForm function component:
export default function EditPasswordForm(//Export default EditPasswordForm function component
    {//PROPS PASSED FROM PARENT COMPONENT (EditUserData.js)
        setError // Function to set the global error state
    }
    ) {
    // ========STATE VARIABLES=================
    // Form variables
    const [currentPassword, setCurrentPassword] = useState('')// State to store the user's current password input
    const [newPassword, setNewPassword] = useState('')// State to store the user's new password input
    const [loading, setLoading] = useState(false);// State variable to indicate if the form is submitting
    // Password visibility variables
    const [showPassword, setShowPassword] = useState(false)// State to toggle visibility of the current password field
    const [showNewPassword, setShowNewPassword] = useState(false)// State to toggle visibility of the new password field
    // Message variables
    const [passwordMsg, setPasswordMsg] = useState(false)// State to toggle the password help text message

      //=============UTILITY FUNCTIONS=============
   // Function to check password strength
    const isStrongPassword = useCallback((pwd) => {
        return /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/ //Regex pattern to check for at least 8 characters and one special character
        .test( 
            String(pwd || '')// Ensure pwd is a string before testing
        );
    }, []);
    // Function to reset the form fields back to their initial state
    const resetForm = useCallback(() => {
          const confirmReset = window.confirm(
             "Are you sure you want to clear the form?"
             );// Prompt the user to confirm before clearing
            if (!confirmReset) return;// If user cancels, exit the function
        setCurrentPassword('');// Clear the current password field
        setNewPassword('')// Clear the new password field
        setError?.(null)// Clear any existing error messages
    },[setError])

    //=============REQUESTS=========================
    //-----------PATCH------------------------------
    // Function to submit the password change to the server
    const editPassword = useCallback(async (e) => {
        setLoading(true)// Set loading state to true while the request is in progress
        e.preventDefault();// Prevent the default form submission behaviour
        setError?.(null)// Clear any previous error messages
        try {
            // Client-side validation checks before sending the request
                if (!currentPassword || !newPassword) {
                    const msg = 'Both current and new passwords are required.';
                    setError?.(msg);// Set the error state to display the error in the UI
                    alert(msg);// Alert the user of the error
                    return;// Exit the function early
                }
                // Conditional rendering to check if new password is different from current password
                if (newPassword === currentPassword) {
                    const msg = 'New password must be different from the current password.';// Error message
                    setError?.(msg);// Set the error state to display the error in the UI
                    alert(msg);// Alert user of error
                    return;// Exit the function early
                }
                // Conditional rendering to check password strength
                if (!isStrongPassword(newPassword)) {
                    const msg = //Message for weak password
                        'New password must be at least 8 characters long and include at least one special character.';
                    setError?.(msg);// Set the error state to display the error in the UI
                    alert(msg);// Alert user of error
                    return;// Exit the function early
                }
                const token = localStorage.getItem('token');// Retrieve JWT token from local storage
                //Conditional rendering to check if token exists
                if (!token) {
                    const msg = 'User is not authenticated. Please log in again.';// Error message for missing token
                    setError?.(msg);// Set the error state to display the error in the UI
                    alert(msg);// Alert user of error
                    return;// Exit the function early
                }
                // Send a PATCH request to update the user's password
                const response = await fetch('http://localhost:3001/users/editPassword', {
                    method: 'PATCH',// HTTP method for partial updates
                    mode: 'cors',// Enable Cross-Origin Resource Sharing
                    headers: {
                        'Content-Type': 'application/json',// Specify the Content-Type in the request payload
                        'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
                    },
                    body: JSON.stringify({// Convert the password data to a JSON string
                        currentPassword,
                        newPassword
                    })
                })
                const data = await response.json().catch(() => ({}));// Safely parse the JSON response (avoid crash if server returns non-JSON)
                /* Conditional rendering to check if the response
            is not successful (status code is not in the range 200-299)*/
                if (!response.ok) {
                    const errorMessage = data.message || 'Failed to change password.';//Default error message
                    setError?.(errorMessage);// Set the error state to display the error in the UI
                    alert(errorMessage);// Alert user of error
                    return;// Exit the function early
                }

                resetForm();// Reset all form fields on success
                console.log('[SUCCESS: EditPasswordForm.js] Password successfully changed');// Log success message to console for debugging
                setLoading(false);// Set loading to false after successful response
                alert('Password changed successfully.');// Notify the user of success
        } catch (error) {
            const msg = error?.message || 'An error occurred while changing the password.';// Default error message
                setError?.(msg);// Set the error state to display the error in the UI
                console.error('[ERROR: EditPasswordForm.js, editPassword]', msg);// Log the error message in the console for debugging
                alert('Error changing password');// Alert user of error
        } finally{
            // Always set loading to false after request completes
                    setLoading(false);
        }
    }, [currentPassword, newPassword, setError, isStrongPassword, resetForm])

    //====================JSX RENDERING====================
  return (
    <form 
        id='editPasswordForm' 
        method='PATCH'
        aria-busy={loading} 
        aria-labelledby='editPasswordForm' 
        onSubmit={editPassword}>
    {/* -------Screen Reader Heading----------- */}
    <p className="visually-hidden" id='editPasswordForm'>EDIT PASSWORD FORM</p>
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
                        value={currentPassword}
                        // EVENTS
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                {/* Button to toggle the visibility of the current password field */}
                <Button
                variant='warning' 
                id='showCurrentPswdBtn'
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                // ARIA ATTRIBUTES
                role='button'
                aria-pressed={showPassword}
                aria-controls='currentPswdInput'
                aria-label={showPassword ? 'Hide current password' : 'Show current password'}
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
                        placeholder='NEW PASSWORD'
                        value={newPassword}
                        // EVENTS
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setPasswordMsg(true)}// show password help text on focus
                        onBlur={() => setPasswordMsg(false)}// hide password help text on blur
                        //ARIA ATTRIBUTES
                        aria-label="New password Input"
                        aria-required='true'
                    />
                     <p className="inputIcon" aria-hidden="true">
                        <small><Asterisk aria-hidden="true" color="red" size={16} /></small>
                    </p>
                    </div>
                    
                </div>
                <div className="p-2" id='showNewPswdBlock'>
                    {/* Button to toggle the visibility of the new password field */}
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
                          {/* Conditional rendering to show password text */}
                    {showNewPassword ? (
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
                {/* Button to reset all form fields */}
                <Button
                variant="danger"
                id='clearFormBtn'
                type='button'
                onClick={resetForm}
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
                {loading ? 'Saving…' : 'Save changes'} <UserKey />
                </Button>
            </Stack>
    </form>
  )
}
