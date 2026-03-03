import React from 'react'
import '../css/componentCSS/FormSetup.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
export default function RegistrationForm() {
  return (
    <form id='registrationForm' >
    {/* Screen Reader Heading */}
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

                />
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
            
            placeholder='FIRST NAME'/>
            </label>
           
               <label className='regisLabel'>
                <p className='labelText'>FIRST NAME:</p>
                  <input
            className='input'
            type='text'
            placeholder='LAST NAME'/>
            </label>
          
          </div>
        </Col>
       
      </Row>
       <Row id='regisRow2'>
        <Col xs={6}>
            <label className='regisLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                className='input'
                type='email'
                    
                />

            </label>
            {/* EMAIL MSG */}
        </Col>
        <Col xs={6}>
            <label className='regisLabel'>
                <p className='labelText'>DATE OF BIRTH:</p>
                <input 
                className='input'
                type='date'/>
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
        </Col>
        <Col xs={12} md={8}>
            <div id='regisPassword'>
                <label className='regisLabel'>
                    <p>PASSWORD</p>
                    <input
                        className='input'
                        placeholder='PASSWORD'
                    />
                </label>
            
                    <Button variant='warning' id='showPasswordBtn'>SHOW PASSWORD</Button>
               
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

    </form>
  )
}
