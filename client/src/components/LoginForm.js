// LoginForm.js
/*LoginForm component: Displays the login form with username and password fields, password
visibility toggle, and client-side validation before submitting credentials.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useMemo, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/LoginForm.css'
import '../css/componentCSS/FormSetup.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
// IMPORT ICONS FROM LUCIDE-REACT
import { Eye, EyeOff, LogIn } from 'lucide-react';

// LoginForm function component
export default function LoginForm(//Export default LoginForm function component
  {//PROPS PASSED FROM PARENT COMPONENT(Login.js)
    userData,    // Object storing the username and password input values
    setUserData, // Function to update the userData state
    submitLogin  // Function to submit the login credentials to the server
  }) {
    // ===========STATE VARIABLES=============
  const [showPassword, setShowPassword] = useState(false)// State to toggle visibility of the password field
  const [passwordMsg, setPasswordMsg] = useState(false)// State to toggle the password help text message
  const [touched, setTouched] = useState({username: false, password: false})// State to track which fields the user has interacted with

     // ========= SIMPLE CLIENT-SIDE VALIDATION STATE =========
  // Memoized "empty" checks (trimmed so "   " counts as empty).
  const usernameEmpty = useMemo(
    () => !String(userData.username || '').trim(), 
    [userData.username]
  );
  const passwordEmpty = useMemo(
    () => !String(userData.password || '').trim(), 
    [userData.password]
  );

  // Only show validation errors AFTER field was touched
  const showUsernameError = touched.username && usernameEmpty;
  const showPasswordError = touched.password && passwordEmpty;

  //==================EVENT LISTENERS=======================
  // Function to handle the login form submission
  const handleLogin = (e) => {
    e.preventDefault();// Prevent the default form submission behaviour
    submitLogin();// Call the submitLogin function passed down from Login.js
  }
  // Function to handle input changes and update the userData state
  const handleLoginInput = (event) => {
    const { name, value } = event.target// Destructure name and value from the input event
    // Update the targeted field in userData immutably
    setUserData((prev) => ({
      ...prev,// Keep all other fields unchanged
      [name]: value,// Update the targeted field
    }))
  }

    // ========= IDs USED BY aria-labelledby / aria-describedby =========
  // Stable ID constants to keep ARIA references readable and consistent
  const formTitleId = 'loginFormTitle';// ID for the screen-reader form title
  const passwordHelpId = 'loginPasswordHelp';// ID for the password help text element
  // Error element IDs referenced by aria-describedby on the inputs
  const usernameErrorId = 'loginUsernameError';// ID for the username validation error message
  const passwordErrorId = 'loginPasswordError';// ID for the password validation error message

 

  //===============================================
  return (
    <form 
      id='loginForm' 
      method='POST' 
      aria-labelledby={formTitleId} 
      onSubmit={handleLogin}>
      {/* LOGIN DETAILS */}
        <div id='loginDetails'>
             <Stack gap={3} id='loginStack1'>
                <div className="p-2" id='formHeadingBlock'>
                  <h3 className='formHeading'>LOGIN</h3>
                      {/* Screen-reader title anchor*/}
                      <h2 id={formTitleId} className="visually-hidden">
                        Login form
                      </h2>
                </div>  
      <div className="p-2" id='usernameBlock'>
      {/* ========USERNAME============== */}
        <label className='loginLabel'>
            <p className='loginLabelText'>USERNAME:</p>
            <input
               className='input'
                id='loginUsername'
                type='text'
                placeholder='USERNAME'
                name='username'
                value={userData.username}
                required
                inputMode="text"// Helpful on mobile keyboards
                onChange={handleLoginInput}
                // ARIA:
                aria-label='Login username input'  
                aria-required="true"
                aria-invalid={usernameEmpty ? 'true' : 'false'}// Mark invalid if empty (simple validation)
                // Link to help + error text (screen reader reads these as extra context)
                aria-describedby={[
              
                  usernameEmpty ? usernameErrorId : null,
                ]
                  .filter(Boolean)
                  .join(' ')}            
            />
        </label>
      </div>
     
     
      {/* Username error (screen reader only) */}
      {showUsernameError && (
        <p id={usernameErrorId} className="visually-hidden" role="alert">
          Username is required.
        </p>
      )}
    </Stack>
     <Stack gap={3} id='loginStack2'>
      <div className="p-2" id='passwordBlock'>
      {/* -----------PASSWORD------------------- */}
        <label className='loginLabel' htmlFor='loginPassword'>
            <p className='loginLabelText'>PASSWORD:</p>
        </label>
        <input
        // STYLING
           className='input'
            id='loginPassword'
            // Attributes
            type={showPassword ? 'text' : 'password'}
            placeholder='PASSWORD'
            name='password'
            value={userData.password}
            // Events
            onChange={handleLoginInput}
            onFocus={() => setPasswordMsg(true)}
            onBlur={() => {
              setPasswordMsg(false);
              setTouched((prev) => ({...prev, password: true}))
            }}
               // ARIA:
            aria-required="true"
            aria-invalid={passwordEmpty ? 'true' : 'false'}
            aria-describedby={[
            passwordMsg ? passwordHelpId : null,
            passwordEmpty ? passwordErrorId : null,
            ]
              .filter(Boolean)
              .join(' ')}
        />
        <div className='showPassword'>
            <Button 
            variant='warning' 
            id='showPasswordBtn'
            onClick= {() => setShowPassword(!showPassword)}
            // ARIA for toggle buttons:
              aria-label={showPassword ? 'Hide password' : 'Show password'}//Provides a clear accessible name for screen readers
              aria-pressed={showPassword}//This turns the button into a toggle button in accessibility terms.
              aria-controls='loginPassword'//Links this button to the element it affects
            >{showPassword ? (
              <>
                HIDE PASSWORD
                <EyeOff
                  style={{ marginLeft: 6 }} 
                  aria-hidden='true'
                  focusable='false'
                />
              </>
            ):(
              <>
                SHOW PASSWORD
                <Eye
                  style={{ marginLeft: 6 }}
                  aria-hidden='true'
                  focusable='false' 
                />
              </>
            )}</Button>
        </div>
      </div>
        {/* Help text shown while password is focused */} 
        {passwordMsg && (
            <div className="p-2" id='passwordMsgBlock'>
              <p className='msgText' id={passwordHelpId} aria-live="polite">
                <strong>We will never share <br/> your password</strong>
              </p>
            </div>
        )}
        {/* Password error (Screen Reader only) */}
        {showPasswordError && (
          <p id={passwordErrorId} className="visually-hidden" role="alert">
            Password is required.
          </p>
        )}
      {/* Button to submit the login form */}
      <div className="p-2" id='loginBtnBlock'>
        <Button
        variant='light'
        id='loginBtn'
        type='submit'
        aria-label='Submit Login form button'
        >
         LOGIN <LogIn aria-hidden='true' />
        </Button>
      </div>
    </Stack>
        </div>
    </form>
  )
}
