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
       
        <Stack gap={3}>
      <div className="p-2">
        <label>
          <p className='labelText'>USERNAME</p>
        </label>
      </div>
      <div className="p-2">Second item</div>
      <div className="p-2">Third item</div>
    </Stack>
       <Stack gap={3}>
      <div className="p-2">
        <label>
          <p className='labelText'>USERNAME</p>
        </label>
      </div>
      <div className="p-2">Second item</div>
      <div className="p-2">Third item</div>
    </Stack></div>
    <Stack gap={2} className="col-md-5 mx-auto">
      <Button variant="secondary">Save changes</Button>
      <Button variant="outline-secondary">Cancel</Button>
    </Stack>
      
    </form>
  )
}
