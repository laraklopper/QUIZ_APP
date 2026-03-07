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
    <header id='header' role='banner'>
    <Row id='headerRow1'>
        <Col>
            <Stack direction="horizontal" gap={3} id='clockStack'>
            <div className="p-2" id='dateTimeBlock'>          
                 <ListGroup variant="flush" id='dateTimeList'>
                                {/* DATE:dateDisplay  -> formats Date into readable date string */}
                                <ListGroup.Item id='dateItem' aria-labelledby='dateLabel'>
                                    <p id='dateLabel' className='visually-hidden'>Current Date:</p>
                                    <h5 className='clockListText'><Calendar size={20}/>{dateDisplay(date)}</h5>
                                </ListGroup.Item>
                                <ListGroup.Item id='timeItem' aria-labelledby='timeLabel'>
                                {/* TIME: timeDisplay  -> formats Date into readable time string */}
                                     <p id='timeLabel' className='visually-hidden'>Current Time:</p>
                                    <h5 className='clockListText'><Clock8 size={20}/>{timeDisplay(date)}</h5>
                                </ListGroup.Item>
                            </ListGroup>  
         
  
            </div>
            <div className="p-2 ms-auto"></div>
            <div className="p-2"></div>
            </Stack>
        </Col>
    </Row>
      <Row id='headerRow2'>
        <Col></Col>
        <Col xs={5} id='headingCol'>
            <Stack gap={3} id='headingStack'>
      <div className="p-2"> <h2 className='pageHeading'>{heading}</h2></div>
      <div className="p-2" id='currentUserName'>
         {/* ====LOGGED IN USERNAME======= */}
            {currentUser?.username && (                         
                    <h2 className="headerStatus">
                    USERNAME: {currentUser.username}
                    </h2>
            )}
      </div>
      <div className="p-2">
        <nav id='navigation'>
                <ul id='navbar'>
                    {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/'>HOME</Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/game'>GAME</Link>
                        </li>
                    )}
                     {currentUser && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/addQuiz'>ADD QUIZ</Link>
                        </li>
                    )}
                     {currentUser?.admin && (
                        <li className='linkItem'>
                            <Link className='refLink' to='/users'></Link>
                        </li>
                    )}
                </ul>
            </nav>
      </div>
    </Stack>
         
        </Col>
        <Col></Col>
      </Row>
        <Row id='headerEventRow' role='presentation' aria-hidden='true'>
        <Col>
            <div>
                <div>
                    <User className='user-slide' size={32} />
                </div>
            </div>
        </Col>
      </Row>
    </header>
  )
}
