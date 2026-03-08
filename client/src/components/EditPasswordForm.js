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
    const [newPassword, setNewPassword] = useState('')

    const [loading, setLoading] = useState(false);// State variable to indicate if the form is submitting
    // Password visibilty variables
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    // Message variables
    const [passwordMsg, setPasswordMsg] = useState(false)

      //=============UTILITY FUNCTIONS=============
   // Function to check password strength
    const isStrongPassword = useCallback((pwd) => {
        return /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/ //Regex pattern to check for at least 8 characters and one special character
        .test( 
            String(pwd || '')// Ensure pwd is a string before testing
        );
    }, []);
    
    const resetForm = useCallback(() => {
        setCurrentPassword('');
        setNewPassword('')
        setError?.(null)
    },[setError])
    //=============REQUESTS=========================
//Function to edit password
const editPassword = useCallback(async (e) => {
    setLoading(true)
    e.preventDefault();
    setError?.(null)
    try {
         // Client-side checks (still keep server-side validation too)
            if (!currentPassword || !newPassword) {
                const msg = 'Both current and new passwords are required.';
                setError?.(msg);
                alert(msg);
                return;
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
            const response = await fetch('http://localhost:3001/users/editPassword', {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                   'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,     
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })
            const data = await response.json().catch (() => ({}));
              /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
            if (!response.ok) {
                const errorMessage = data.message || 'Failed to change password.';//Default error message
                setError?.(errorMessage);// Set the error state to display the error in the UI
                alert(errorMessage);// Alert user of error
                return;// Exit the function early
            }

            resetForm();// Reset form fields on success
            console.log('[SUCCESS: EditPasswordForm.js] Password successfully changed');// Log success message to console for debugging
            setLoading(false);//Set loading to false
            // setError?.(null)// Clear any error messages
            alert('Password changed successfully.');// Alert user of success
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
    <form id='editPasswordForm' aria-busy={loading} aria-labelledby='editPasswordForm' onSubmit={editPassword}>
    {/* Screen Reader Heading */}
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? 'Saving…' : 'Save changes'}
                </Button>
            </Stack>
  
        
    </form>
  )
}
