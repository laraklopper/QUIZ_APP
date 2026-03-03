import React from 'react'
import '../css/componentCSS/LoginForm.css'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function LoginForm({userData}) {
  return (
    <form id='loginForm' method='POST'>
        <div id='loginDetails'>
             <Stack gap={3} id='loginStack1'>
      <div className="p-2" id='formHeadingBlock'>
        <h3 className='formHeading'>LOGIN</h3>
      </div>
      <div className="p-2" id='usernameBlock'>
        <label className='loginLabel'>
            <p className='loginLabelText'>USERNAME:</p>
            <input
            className='input'
                type='text'
                placeholder='USERNAME'
                name='username'
                value={userData.username}
            />
        </label>
      </div>
      <div className="p-2">
        {/* Username message */}
      </div>
    </Stack>
     <Stack gap={3} id='loginStack2'>
      <div className="p-2" id='passwordBlock'>
        <label className='loginLabel' htmlFor='loginPassword'>
            <p className='loginLabelText'>PASSWORD:</p>
        </label>
        <input
        type='password'
        className='input'
        id='loginPassword'
            placeholder='PASSWORD'
            name='password'
            value={userData.password}
        />
        <div>
            <Button variant='warning' id='showPasswordBtn'>SHOW PASSWORD</Button>
        </div>
      </div>
      <div className="p-2">
        {/* Password Message */}
      </div>
      <div className="p-2">
        <Button>
            LOGIN
        </Button>
      </div>
    </Stack>
        </div>
    </form>
  )
}
