import React from 'react'
import '../css/componentCSS/Header.css';
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';
import { UserLock } from 'lucide-react';
export default function MainHeader({mainHeading}) {
    //=========================JSX RENDERING==================
  return (
    <header id='header'>
        <Row id='headerRow1'>
            <Col id='headerCol1'>
                  <Stack direction="horizontal" gap={3} id='headerStack'>
                    <div className="p-2">
                        {/* Header Clock */}
                    </div>
                    <div className="p-2 ms-auto"></div>
                    <div className="p-2" id='navigation'>
                        <nav className='navigation'>
                            <ul id='loginNavbar'>
                                <li className='linkItem'>
                                    <Link className='refLink' to='/'>LOGIN</Link>
                                </li>
                                <li className='linkItem'>
                                    <Link className='refLink' to='/reg'>REGISTRATION</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                 </Stack>
            </Col>
        </Row>
        <Row id='headerRow2'>
            <Col></Col>
            <Col xs={5}>
                <div id='headingBlock'>
                    <h1 id='appHeading'>QUIZ</h1>
                    <h2 id='pageHeading'>{mainHeading}</h2>
                </div>
            </Col>
            <Col></Col>
        </Row>
        <Row id='headerEventRow'>
            <Col id='headerCol1'>
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
