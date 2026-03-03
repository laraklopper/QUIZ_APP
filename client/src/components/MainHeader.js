import React from 'react'
import '../css/componentCSS/Header.css';
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Stack from 'react-bootstrap/Stack';

export default function MainHeader() {
  return (
    <header id='header'>
        <Row>
            <Col>
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                        {/* Header Clock */}
                    </div>
                    <div className="p-2 ms-auto">Second item</div>
                    <div className="p-2">Third item</div>
                 </Stack>
            </Col>
        </Row>
        <Row>
            <Col></Col>
            <Col xs={5}></Col>
            <Col></Col>
        </Row>
        <Row>
            <Col>
                <div>
                    <div></div>
                </div>
            </Col>
        </Row>
    </header>
  )
}
