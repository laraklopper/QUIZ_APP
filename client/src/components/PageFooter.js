import React, { useEffect, useState } from 'react'
import '../css/componentCSS/Footer.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import { Calendar, Clock8 } from 'lucide-react';
import { Copyright } from 'lucide-react';
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

//*PageFooter component: Displays the footer of the application, including the current date and time, and copyright information.*/
export default function PageFooter() {
    //========STATE VARIABLES================
    const [footerDate, setFooterDate] = useState(new Date())

    //=================USE EFFECT HOOK TO UPDATE TIME======================
    useEffect(() => {
        // Create an interval that updates the time every second
        const timer = setInterval(() => {  
            setFooterDate(new Date())
        }, 1000);
        // Cleanup function:
        // Clears interval when component unmounts
        // Prevents memory leaks and duplicate timers
        return () => clearInterval(timer)
    }, [])// Empty dependency array → runs once on mount

    //=========================JSX RENDERING==================

  return (
    <footer className="page-footer">
        <Row id='footerRow1'>
        <Col id='footerCol1'></Col>
      </Row>
      {/* FOOTER TIME AND DATE DISPLAY */}
      <Row id='footerRow2'>
        <Col id='footerCol2'>
        <Stack direction="horizontal" gap={3} id='footerTimeStack'>
            <div className="p-2"></div>
            <div className="p-2 ms-auto"></div>
            <div className="p-2" id='footerTimeBlock'>
                <div id='footerClock'>
                        <ListGroup variant="flush" id='footerDateTime' aria-labelledby='footeDateTimeTitle'>
                        <p id='footerDateTimeTitle' className='visually-hidden'>Current Date & Time</p>
                            <ListGroup.Item id='footerDateItem'>
                             {/* DATE:dateDisplay  -> formats Date into readable date string */}
                                <h5 className='timeStamp'><Calendar size={20} fontWeight={700} fontFamily='"Playpen Sans", cursive'/>{dateDisplay(footerDate)}</h5>
                            </ListGroup.Item>
                            <ListGroup.Item id='footerTimeItem'>
                            {/* TIME: timeDisplay  -> formats Date into readable time string */}
                                <h5 className='timeStamp'><Clock8 size={20} fontWeight={700} fontFamily='"Playpen Sans", cursive'/>{timeDisplay(footerDate)}</h5>
                            </ListGroup.Item>
                        </ListGroup>
                </div>
            </div>
        </Stack>
        </Col>
      </Row>
      {/* COPYRIGHT INFORMATION */}
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
