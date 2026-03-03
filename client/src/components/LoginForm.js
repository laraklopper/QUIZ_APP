import React, { useMemo, useState } from 'react'
import '../css/componentCSS/LoginForm.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Eye, EyeOff, LogIn } from 'lucide-react';


export default function LoginForm({userData, setUserData}) {
  const [showPassword, setShowPassword] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(false)
  const [touched, setTouched] = useState({username: false, password: false})

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
    //Function for handling user login data changes
  const handleLoginInput = (event) => {
    const { name, value } = event.target
    // Update userData object immutably
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

    // ========= IDs USED BY aria-labelledby / aria-describedby =========
  // Keeps ARIA references stable and readable
  const formTitleId = 'loginFormTitle';
  const usernameHelpId = 'loginUsernameHelp';
  const passwordHelpId = 'loginPasswordHelp';
  // error IDs (for aria-describedby)
  const usernameErrorId = 'loginUsernameError';
  const passwordErrorId = 'loginPasswordError';

 

  //===============================================
  return (
    <form id='loginForm' method='POST' aria-describedby={formTitleId}>

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
                onFocus={() => setUsernameMsg(true)}
                onBlur={() => {
                      setUsernameMsg(false);
                      setTouched((prev) => ({ ...prev, username: true }));
                }}
                // ARIA:
                aria-label='Login username input'  
                aria-required="true"
                aria-invalid={usernameEmpty ? 'true' : 'false'}// Mark invalid if empty (simple validation)
                // Link to help + error text (screen reader reads these as extra context)
                aria-describedby={[
                  usernameMsg ? usernameHelpId : null,
                  usernameEmpty ? usernameErrorId : null,
                ]
                  .filter(Boolean)
                  .join(' ')}            
            />
        </label>
      </div>
     {/* Help text: announced politely while focused (and only shown when usernameMsg=true) */}
      {usernameMsg && (
        <div className="p-2" id="usernameMsgBlock">
          <p
            className="msgText"
            id={usernameHelpId}
            // ARIA: 
            aria-live="polite"//polite live region so it can be announced without interrupting
          >
            <strong> We will never share <br /> your username</strong>
          </p>
        </div>
      )}
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
            type='password'   
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
            <div className="p-2" id='messageBlock'>
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
