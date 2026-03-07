import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import {dateDisplay} from '../utilFunctions/dateFunctions'

export default function EditUserData({currentUser}) {

    const username = currentUser?.username || 'Username Not provided'//User username
    const firstName = currentUser?.fullName?.firstName || 'First name not provided';//User First name
    const lastName = currentUser?.fullName?.lastName || 'Last name not provided';//User Last 
    const email = currentUser?.email || 'No email provided';//User Email
    const dateOfBirth = currentUser?.dateOfBirth || 'No date provided';//User Date of Birth
    const isAdmin = currentUser?.admin ? 'Yes' : 'No';//User Admin Status

  return (
    <div id='userDetails'>
          <Row id='userDetailsRow1'>
           <Col xs={6} md={4}>
           {/* Username */}
        <span className='userDetailsLabel'>
            <h5 className='dataTextHead'>USERNAME:</h5>
            <h5 id='usernameDataText'>{username}</h5>
        </span>
        </Col>
        <Col xs={12} md={8}>
            {/* User Full Name */}
            <span className='userDetailsLabel'>
                <h5 className='dataTextHead'>NAME:</h5>
                <h5 className='userFullName'>{`${firstName} ${lastName}`} </h5>
            </span>

        </Col>
       
       <Row>
        <Col xs={6} md={4}>
               <span className='userDetailsLabel'>
                          <h5 className='dataTextHead'>EMAIL: </h5>
                          <h5 className='dataText'>{email}</h5>
                      </span>
        </Col>
        <Col xs={6} md={4}>
              <span className='userDetailsLabel'>
                <h5 className='dataTextHead'>DATE OF BIRTH: </h5>
                <h5 className='dataText'>{dateDisplay(dateOfBirth)}</h5>
            </span>
        </Col>
        <Col xs={6} md={4}>
          {/* User admin status*/}
            <span className='userDetailsLabel'>
                <h5 className='dataTextHead'>ADMIN: </h5>
                <h5 id='adminDataText'>{isAdmin}</h5>
            </span>
        </Col>
      </Row>
      </Row>
        {/* Edit User details */}
      
        <Row id='toggleEditUserRow'>
        <Col>
              <Stack gap={3}>
      <div className="p-2">
        {/* Edit user buttons */}
      </div>
      <div className="p-2">
        {/* Edit userdeadta */}
      </div>
      <div className="p-2">
        {/* Edit passwordForm. */}
      </div>
    </Stack>
        </Col>
      </Row>
    </div>
  )
}
