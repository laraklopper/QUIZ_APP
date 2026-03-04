import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import { Calendar, Clock8 } from 'lucide-react';
import { dateDisplay, timeDisplay } from '../utilFunctions/dateFunctions';

export default function PageFooter() {
    const [footerDate, setFooterDate] = useState(new Date())

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
      <Row id='footerRow2'>
        <Col id='footerCol2'>
        <Stack direction="horizontal" gap={3} id='footerTimeStack'>
            <div className="p-2"></div>
            <div className="p-2 ms-auto"></div>
            <div className="p-2" id='footerTimeBlock'>
                <div id='footerClock'>
                        <ListGroup variant="flush" id='footerDateTime'>
                            <ListGroup.Item id='dateItem'>
                                <h5 className='clockListText'><Calendar size={20}/>{dateDisplay(footerDate)}</h5>
                            </ListGroup.Item>
                            <ListGroup.Item id='timeItem'>
                                <h5 className='clockListText'><Clock8 size={20}/>{timeDisplay(footerDate)}</h5>
                            </ListGroup.Item>
                        </ListGroup>
                </div>
            </div>
        </Stack>
        </Col>
      </Row>
       <Row>
        <Col>1 of 3</Col>
        <Col xs={5}>
            <p id='footerText'>© 2026 Quiz App. All rights reserved.</p>
        </Col>
        <Col>3 of 3</Col>
      </Row>
    </footer>
  )
}
