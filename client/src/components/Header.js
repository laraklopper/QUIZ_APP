import React, { useEffect, useState } from 'react'
import '../css/componentCSS/Header.css'
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';// Import the ListGroup component from react-bootstrap
import { Clock8, Calendar, User } from 'lucide-react';
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';
import { Link } from 'react-router-dom';


export default function Header({currentUser, heading}) {
    const [date, setDate] = useState()

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)
        return () => clearInterval(timer)
    },[])

  return (
    <header id='header' role='banner' aria-labelledby='loggedInHeader'>
    {/* -----SCREEN READER HEADING----------- */}
    <p className='visually-hidden' id='loggedInHeader'>HEADER</p>
    {/* HEADER ROW 1: Clock*/}
    <Row id='headerRow1'>
        <Col id='headerCol1' aria-live='polite' >
            <Stack direction="horizontal" gap={3} id='clockStack'>
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
        <Row id='headerEventRow' role='presentation' aria-hidden='true'>
        <Col id='headerEventCol'>
        {/* ---------EVENT/ANIMATION--------------- */}
            <div className='header-event-bar'>
                <div className='event-track'>
                    <User className='user-slide' size={32} />
                </div>
            </div>
        </Col>
      </Row>
    </header>
  )
}
