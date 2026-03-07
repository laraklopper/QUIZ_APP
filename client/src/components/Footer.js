import React from 'react'
import '../css/componentCSS/Footer.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function Footer({logout}) {
  return (
    <footer id='footer' role='banner'>
     <Row id='footerRow1'>
        <Col id='footerCol1'>
            <Stack direction="horizontal" gap={3} id='footerStack1'>
                <div className="p-2">
                    {/* uSER DETAIL
                        USERNAME
                        lOGGED IN AS USER/ADMIN
                    */}
                </div>
                <div className="p-2 ms-auto"></div>
                <div className="p-2">
                {/* FOOTER CLOCK */}
                </div>
            </Stack>
        </Col>
      </Row>
      <Row id='footerRow2'>
        <Col id='footerCol2'>
            <Stack direction="horizontal" gap={3} id='footerStack2'>
                <div className="p-2"></div>
                <div className="p-2 ms-auto"></div>
                <div className="p-2">
                 <Button variant="warning" onClick={logout} id='logoutBtn' type='button' aria-label='Logout Button'>LOGOUT</Button>
                </div>
            </Stack>
        </Col>
      </Row>
    </footer>
  )
}
