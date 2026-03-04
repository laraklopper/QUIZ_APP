import React, {useState, useEffect} from 'react'
import '../css/componentCSS/Header.css';
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import ListGroup from 'react-bootstrap/ListGroup';// Import the ListGroup component from react-bootstrap
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';
// Import icons from lucide-react
import { UserLock, ChartBarBig, LogIn, Calendar, Clock8 } from 'lucide-react';
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

/*MainHeader component: Displays the main header of the application, 
including the current date and time, navigation links, and page heading.*/
export default function MainHeader({mainHeading}) {
    const [headerDate, setHeaderDate] = useState()

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
                        <nav className='navigation'>
                            <ul id='loginNavbar'>
                                <li className='linkItem'>
                                    <Link className='refLink' to='/'><LogIn className='linkIcon'/>LOGIN</Link>
                                </li>
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
            <Col xs={5} id='headingCol'>
                <div id='headingBlock'>
                    <h1 id='appHeading'>QUIZ</h1>
                    <h2 id='pageHeading'>{mainHeading}</h2>
                </div>
            </Col>
            <Col></Col>
        </Row>
        {/* Header Row 3: Event Bar */}
        <Row id='headerEventRow' role='presentation' aria-hidden='true'>
            <Col id='headerEventCol' aria-live='polite'>
                <div className='header-event-bar'>
                    <div className='event-track'>
                        <UserLock className='user-slide' />
                    </div>
                </div>
            </Col>
        </Row>
    </header>
  )
}
