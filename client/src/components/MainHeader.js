// MainHeader.js
/*MainHeader component: Displays the main header of the application,
including the current date and time, navigation links, and page heading.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, {useState, useEffect} from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/Header.css';
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';
// IMPORT ICONS FROM LUCIDE-REACT
import { UserLock, ChartBarBig, LogIn, Calendar, Clock8 } from 'lucide-react';
// IMPORT UTILITY FUNCTIONS
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

//MainHeader function component
export default function MainHeader(//Export default MainHeader function component
    {//PROPS PASSED TO PARENT COMPONENT(Login.js, Registration.js)
        mainHeading}) {
    //=================STATE VARIABLES================
    const [headerDate, setHeaderDate] = useState()//State to store header date/time (updated every second)

    useEffect(() => {
    // Create an interval that updates the time every second
    const timer = setInterval(() => {
      setHeaderDate(new Date())
    }, 1000);
    // Cleanup function:
    // Clears interval when component unmounts
    // Prevents memory leaks and duplicate timers
    return () => clearInterval(timer)
  }, [])// Empty dependency array → runs once on mount


    //=========================JSX RENDERING==================
  return (
    <header id='header'>
    {/* Header Row 1: Date and Time + Navigation */}
        <Row id='headerRow1'>
            <Col id='headerCol1'>
                  <Stack direction="horizontal" gap={3} id='headerStack'>
                    <div className="p-2" id='dateTimeBlock'>
                        {/* Header Clock */}
                        <div id='headerClock' aria-label='Current Date and Time'>                   
                            <ListGroup variant="flush" id='dateTimeList'>
                                {/* DATE:dateDisplay  -> formats Date into readable date string */}
                                <ListGroup.Item id='dateItem' aria-labelledby='dateLabel'>
                                    <p id='dateLabel' className='visually-hidden'>Current Date:</p>
                                    <h5 className='clockListText'><Calendar size={20}/>{dateDisplay(headerDate)}</h5>
                                </ListGroup.Item>
                                <ListGroup.Item id='timeItem' aria-labelledby='timeLabel'>
                                {/* TIME: timeDisplay  -> formats Date into readable time string */}
                                     <p id='timeLabel' className='visually-hidden'>Current Time:</p>
                                    <h5 className='clockListText'><Clock8 size={20}/>{timeDisplay(headerDate)}</h5>
                                </ListGroup.Item>
                            </ListGroup>                        
                        </div>
                    </div>
                    <div className="p-2 ms-auto"></div>
                    <div className="p-2" id='navigation'>
                    {/* Navigation Bar before Login*/}
                        <nav className='navigation'>
                            <ul id='loginNavbar'>
                            {/* Navigation Links */}
                                 {/* Link to Login Page */}
                                <li className='linkItem'>
                                    <Link className='refLink' to='/'><LogIn className='linkIcon'/>LOGIN</Link>
                                </li>
                                {/* Link to Registration Page */}
                                <li className='linkItem'>
                                    <Link className='refLink' to='/reg'><ChartBarBig className='linkIcon'/>REGISTRATION</Link>
                                </li>   
                            </ul>
                        </nav>
                    </div>
                 </Stack>
            </Col>
        </Row>
        {/* Header Row 2: Page Heading + main App Heading */}
        <Row id='headerRow2'>
            <Col></Col>
            <Col xs={5} id='mainHeadingCol'>
                <div id='headingBlock'>
                    <h1 id='appHeading'>QUIZ</h1>
                    <h2 id='pageHeading'>{mainHeading}</h2>
                </div>
            </Col>
            <Col></Col>
        </Row>
        {/* Header Row 3: Event Bar */}
        <Row id='headerEventRow' className='g-0' role='presentation' aria-hidden='true'>
            <Col id='headerEventCol'>
            {/* ------------EVENT ANIMATION-------------- */}
                <div className='header-event-bar'>
                    <div className='event-track'>
                        <UserLock className='user-slide' size={32} focusable='false' aria-hidden='true' />
                    </div>
                </div>
            </Col>
        </Row>
    </header>
  )
}
