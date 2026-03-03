import React, { useState } from 'react'
import '../css/componentCSS/FormSetup.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Asterisk, Eye, EyeOff } from 'lucide-react';

export default function RegistrationForm({newUserData}) {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState(false)
    const [emailMsg, setEmailMsg] = useState(false)

    const handleInputChange = (event) => {
        
    }
  return (
    <form id='registrationForm' >
    {/* Screen Reader Heading */}
    <div id='registrationDetails'>
<Row id='regisHeadingRow'>
        <Col></Col>
        <Col xs={5}>
        <div id='formHeadingBlock'>
<h3 className='formHeading'>SIGN UP</h3>
        </div>
            
        </Col>
        <Col></Col>
      </Row>
          <Row id='regisRow1'>
           <Col xs={6} md={4}>
             
                <label className='regisLabel'>
                    <p className='labelText'>USERNAME:</p>
                     <input
                    className='input'
                    id='regisUsername'
                    type='text'
                    placeholder='USERNAME'
                    name='username'
                    value={newUserData.username}

                />
                <Asterisk size={16} color='red'/>
                </label>
               
       
            </Col>
        <Col xs={12} md={8}>
          <div id='regisName'>
            <label className='regisLabel'>
                <p className='labelText'>FIRST NAME:</p>
                <input
            className='input' 
            type='text'
            required
            name='fullName.firstName'
            value={newUserData.fullName.firstName}

            placeholder='FIRST NAME'/>
            <Asterisk size={16}/>
            </label>
           
               <label className='regisLabel'>
                <p className='labelText'>FIRST NAME:</p>
                  <input
            className='input'
            type='text'
            placeholder='LAST NAME'
            required
            name='fullName.lastName'
            value={newUserData.fullName.lastName}
            


            />
            <Asterisk size={16}/>
            </label>
          
          </div>
        </Col>
       
      </Row>
       <Row id='regisRow2'>
        <Col xs={6}>
        <div id='regisEmail'>
            <label className='regisLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                className='input'
                type='email'
                placeholder='EMAIL'
                required
                name='email'
                value={newUserData.email}
                onFocus={() => setEmailMsg(true)}
                onBlur={() => setEmailMsg(false)}
                
                    
                />
<Asterisk size={16}/>
            </label>
            {emailMsg && (
                <div id='emailMsg'>
                    <p className='msgText'><strong>WE WILL NEVER SHARE YOUR EMAIL</strong></p>
                </div>
            )}
        </div>
            

            
        </Col>
        <Col xs={6}>
            <label className='regisLabel'>
                <p className='labelText'>DATE OF BIRTH:</p>
                <input 
                className='input'
                type='date'/>
                <Asterisk size={16}/>
            </label>
        </Col>
      </Row>
     <Row id='regisRow3'>
        <Col xs={6} md={4}>
            <label className='regisLabel'>
            <p className='labelText'>REGISTER AS ADMIN:</p>
            <input
            type='checkbox'/>

            </label>
            <p className='visibleMsg'>ADMIN USERS MUST BE 18 YEARS OR OLDER</p>
        </Col>
        <Col xs={12} md={8}>
            <div id='regisPassword'>
                <label className='regisLabel'>
                    <p className='labelText'>PASSWORD</p>
                    <input
                        className='input'
                        placeholder='PASSWORD'
                        type={showPassword ? 'text' : 'password'}//Toggle input type
                        required
                        onFocus={() => setPasswordMsg(true)}
                        onBlur={() => setPasswordMsg(false)}
                        aria-required='true'
                    />
                    <Asterisk size={16} color='red'/>
                </label>
                    <Button 
                    variant='warning' 
                    id='showPasswordBtn' 
                    onClick={() =>setShowPassword((s) => !s)}>
                         {showPassword ? (
                                <>
                                HIDE PASSWORD
                                <EyeOff 
                                style={{ marginLeft: 6 }} 
                                aria-hidden='true'
                                focusable='false'//Prevents SVG icon from becoming keyboard-focusable.
                                />
                                </>
                              ):(
                                <>
                                SHOW PASSWORD
                                <Eye
                                style={{marginLeft: 6}}
                                aria-hidden='true'
                                focusable='false'//Prevents SVG icon from becoming keyboard-focusable.
                                />
                                </>
                              )}
                    </Button>
               <div>
                {passwordMsg && (
                    <div>
                        <p className='msgText'>
                         <strong> WE WILL NEVER SHARE YOUR PASSWORD </strong>
                       </p>
                    </div>
                )}
               </div>
            </div>
        </Col>
      </Row>
      <Row id='regisRow4'>
      <Col></Col>
        <Col xs={5}>
             <Stack gap={2} className="col-md-5 mx-auto">
      <Button variant="light" id='registerBtn'>REGISTER</Button>
      <Button variant="danger" id='clearFormBtn'>CLEAR FORM</Button>
    </Stack>
        </Col>
        <Col></Col>
      </Row>

    </div>
     
    </form>
  )
}
