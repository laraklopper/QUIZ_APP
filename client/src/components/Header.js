// Header.js
/*Header component: Displays the main navigation header for logged-in users, including the
current date and time, page heading, username, navigation links, and an animated event bar.*/
//IMPORT REQUIRED MODULES AND PACKAGES
import React, { useEffect, useState } from 'react'
// IMPORT CSS STYLESHEETS
import '../css/componentCSS/Header.css'
// IMPORT COMPONENT ANIMATIONS CSS
import '../css/componentCSS/ComponentAnimations.css'
// IMPORT BOOTSTRAP COMPONENTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
// IMPORT ICONS FROM LUCIDE-REACT
import { Clock8, Calendar, User } from 'lucide-react';
// IMPORT UTILITY FUNCTIONS
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

//Header function component
export default function Header(//Export default Header function component
    {//PROPS PASSED FROM PARENT COMPONENT (Home.js, Game.js, AddQuiz.js, Users.js)
        currentUser, 
        //PROPS PASSED TO PARENT COMPONENTS (Home.js, Game.js, AddQuiz.js, Users.js)
        heading
    }
) {
    //============STATE VARIABLES=============
    const [date, setDate] = useState()//State to store date/time (updated every second)

    //===========USE EFFECT HOOK===============
    //useEffect hook to display date and time
    useEffect(() => {
        // Create an interval that updates the time every second
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)
        // Cleanup function:
        // Clears interval when component unmounts
      // Prevents memory leaks and duplicate timers
        return () => clearInterval(timer)
    },[])

    //==================JSX RENDERING==================
  return (
    <header id='header' role='banner' aria-labelledby='loggedInHeader'>
    {/* -----SCREEN READER HEADING----------- */}
    <p className='visually-hidden' id='loggedInHeader'>HEADER</p>
    {/* HEADER ROW 1: Clock*/}
    <Row id='headerRow1'>
        <Col id='headerCol1' aria-live='polite' >
            <Stack direction="horizontal" gap={3} id='headerClockStack'>
            {/* CLOCK */}
            <div className="p-2" id='dateTimeBlock'>          
                 <ListGroup variant="flush" id='dateTimeList'>
                                {/* Header Date */}
                                <ListGroup.Item id='dateItem' aria-labelledby='dateLabel'>
                                {/* -------Date Screen Reader Heading------------- */}
                                    <p id='dateLabel' className='visually-hidden'>Current Date:</p>
                                    {/* DATE:dateDisplay  -> formats Date into readable date string */}
                                    <h5 className='clockListText'><Calendar size={20}/>{dateDisplay(date)}</h5>
                                </ListGroup.Item>
                                {/* Header Time */}
                                <ListGroup.Item id='timeItem' aria-labelledby='timeLabel'>                               
                                {/* ---------Time Screen Reader Heading--------------- */}
                                     <p id='timeLabel' className='visually-hidden'>Current Time:</p>
                                     {/* TIME: timeDisplay  -> formats Date into readable time string */}
                                    <h5 className='clockListText'><Clock8 size={20}/>{timeDisplay(date)}</h5>
                                </ListGroup.Item>
                            </ListGroup>  
                        </div>
                        <div className="p-2 ms-auto"></div>
                        <div className="p-2"></div>
            </Stack>
        </Col>
    </Row>
    {/* HEADER ROW 2: Page Heading + CurrentUsername + Navigation Bar*/}
      <Row id='headerRow2'>
        <Col id='headingCol'>
            <Stack gap={3} id='headingStack'>
                <div className="p-2"> <h2 id='pageHeading'>{heading}</h2></div>
                <div className="p-2" id='currentUserName'>
            {/* ====LOGGED IN USERNAME======= */}
            {currentUser?.username && (                         
                    <h2 className="headerStatus">
                        USERNAME: {currentUser.username}
                    </h2>
            )}
      </div>
      <div className="p-2" id='navbarBlock'>
      {/* ----------NAVIGATION BAR---------- */}
        <nav id='navigation'>
                <ul id='navbar' aria-label='LoggedIn Navigation Bar'>
                {/* Link to Home Page */}
                    {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/'>HOME</Link>
                        </li>
                    )}
                    {/* Link to Game Page */}
                    {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/game'>GAME</Link>
                        </li>
                    )}
                    {/* Link to AddQuiz Page */}
                     {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/addQuiz'>ADD QUIZ</Link>
                        </li>
                    )}
                    {/* Link to Users Page: Admin only */}
                     {currentUser?.admin && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/users'>USERS</Link>
                        </li>
                    )}
                </ul>
                </nav>
            </div>
            </Stack>
        </Col>
      </Row>
      {/* HEADER EVENT ROW */}
        <Row id='headerEventRow' className='g-0' role='presentation' aria-hidden='true'>
        <Col id='headerEventCol'>
        {/* ---------EVENT/ANIMATION--------------- */}
            <div className='header-event-bar'>
                <div className='event-track'>
                    <User className='user-slide' size={32} focusable='false' aria-hidden='true' />
                </div>
            </div>
        </Col>
      </Row>
    </header>
  )
}
