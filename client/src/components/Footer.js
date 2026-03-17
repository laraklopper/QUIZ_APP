// Footer.js
/*Footer component: Displays the footer of the application, 
including the current date and time, logout Button and copyright information.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useEffect, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/Footer.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
// IMPORT ICONS FROM LUCIDE-REACT
import { Calendar, Clock8, LogOut, ShieldUser, User} from 'lucide-react';
import { Copyright } from 'lucide-react';
// Import Utility Functions
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

//*Footer component: Displays the footer of the application, including the current date and time, logout Button and copyright information.*/
export default function Footer(//Export default Footer component
  {//PROPS PASSED FROM PARENT COMPONENT (Home.js, Game.js, AddQuiz.js, Users.js)
    currentUser, 
    logout
  }
) {
  //=============STATE VARIABLES=============
  const [date, setDate] = useState(new Date());//State to store current date/time (updated every second)

  //===========USE EFFECT HOOK===============
    //useEffect hook to create timer
  useEffect(() => {
     // Create an interval that updates the time every second
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000);
    // Cleanup function:
      // Clears interval when component unmounts
      // Prevents memory leaks and duplicate timers
    return () => clearInterval(timer)
  },[])

  //===============JSX RENDERING===========
  
  return (
    <footer id='footer' role='banner'>
    {/* FOOTER ROW 1 */}
     <Row id='footerRow1'>
        <Col id='footerCol1'>
            <Stack direction="horizontal" gap={3} id='footerStack1'>
                <div  id='footerDetailsBlock'>
                    {currentUser && ( 
                      <ul id='footerStatusList'>
                      {/* Username */}
                        <li className='footerListItem'>
                          <span id='footerUsername'>
                            <h6 className='footerStatusLabel'>USERNAME:</h6>
                            <h6 className='footerStatusItem'>{currentUser.username}</h6>
                          </span>
                        </li>
                         {/* User Admin status */}
                          <li className='footerListItem'> 
                            <span id='adminDetails'>
                                  <h6 className='footerStatusLabel'>Logged in as:</h6>
                                      {/*Display based on whether or not user is admin  */}
                                <h6 id='adminStatus'>
                                  {currentUser.admin ? (
                                    // Display if admin user
                                    <><ShieldUser style={{ marginRight: 6 }}  fontWeight={700} aria-hidden='true'/>ADMIN </>
                                    ) : (
                                      // Display if normal user
                                    <><User style={{ marginRight: 6 }} fontWeight={700} aria-hidden='true' />USER</>
                                    )}
                                </h6>
                            </span>
                          </li>
                      </ul>
                    )}
                </div>
                <div className="p-2 ms-auto"></div>
                <div className="p-2" id='dateTimeBlock'>
                {/* FOOTER CLOCK */}
                 <ListGroup variant='flush' id='dateTimeList' aria-labelledby='loggedInFooterDateTimeTitle'>
                  <p id='loggedInFooterDateTimeTitle' className='visually-hidden'>Current Date & Time</p>
                      <ListGroup.Item id='footerDateItem'>
                      {/* DATE: dateDisplay  -> formats Date into readable date string */}
                        <h5 className='listIcon' aria-hidden='true'><Calendar fontWeight={700} size={20} fontFamily='"Playpen Sans", cursive'/></h5>
                        <h5 className='timeStamp'>{dateDisplay(date)}</h5>
                      </ListGroup.Item>
                      <ListGroup.Item id='footerDateItem'>
                        {/* TIME: timeDisplay  -> formats Date into readable time string */}
                        <h5 className='listIcon' aria-hidden='true'><Clock8 fontWeight={700} size={20} fontFamily='"Playpen Sans", cursive'/> </h5>
                        <h5 className='timeStamp'>{timeDisplay(date)}</h5>
                      </ListGroup.Item>
                 </ListGroup>
                </div>
            </Stack>
        </Col>
      </Row>
      {/* FOOTER ROW 2 : Logout Button */}
      <Row id='footerRow2'>
        <Col id='footerCol2'>
            <Stack direction="horizontal" gap={3} id='footerStack2'>
                <div className="p-2"></div>
                <div className="p-2 ms-auto"></div>
                <div id='logoutBlock'>
                 <Button 
                  variant="warning" 
                  onClick={logout} 
                  id='logoutBtn' 
                  type='button' 
                  aria-label='Logout Button'>
                  LOGOUT <LogOut aria-hidden='true'/>
                  </Button>
                </div>
            </Stack>
        </Col>
      </Row>
       {/*FOOTER ROW 3: COPYRIGHT INFORMATION */}
       <Row id='footerRow3'>
           <Col id='footerCol3'></Col>
            {/* COPYRIGHT INFORMATION */}
            <Col  xs={5} id='footerTextCol' aria-labelledby='footerTextTitle'>
            <div aria-labelledby='footerTextTitle' id='copyRightBlock'>
                <p id='footerTextTitle' className='visually-hidden'>Copyright</p>
                <h6 id='footerText'> <Copyright size={16}/>2026 Quiz App. All rights reserved.</h6>
            </div>            
            </Col>
            <Col id='footerCol4'></Col>
        </Row>
    </footer>
  )
}
