import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

export default class NotFound extends React.Component {

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Online Classroom</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </Navbar>
        <p style={{marginTop: 50}}>Couldn't Find the page you were looking for?</p>
        <p>It might have been moved. Check again soon</p>
        <Button href="/">
          Home
        </Button>
      </div>
    )
  }
}