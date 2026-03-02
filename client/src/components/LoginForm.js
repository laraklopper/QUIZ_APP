import React from 'react'
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function LoginForm({userData}) {
  return (
    <form>
        <div id='loginDetails'>
             <Stack gap={3} id='loginStack1'>
      <div className="p-2">
        <h3 className='formHeading'>LOGIN</h3>
      </div>
      <div className="p-2">
        <label className='loginLabel'>
            <p className='loginLabelText'>USERNAME:</p>
            <input
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
      <div className="p-2">
        <label className='loginLabel' htmlFor='loginPassword'>
            <p className='labelText'>PASSWORD:</p>
        </label>
        <input
        type='password'
        id='loginPassword'
            placeholder='PASSWORD'
            name='password'
            value={userData.password}
        />
        <div>
            <Button variant='warning'>SHOW PASSWORD</Button>
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
