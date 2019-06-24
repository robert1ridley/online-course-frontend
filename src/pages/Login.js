import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Register from '../components/Register';
import SignIn from '../components/SignIn';

export default class Login extends React.Component {
  state = {
    login: true
  }

  onLogin = () => {
    this.setState({
      login: true
    })
  }

  onSignup = () => {
    this.setState({
      login: false
    })
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Online Classroom</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </Navbar>
        <Container>
          <Row>
            <Col />
            <Col>
              <ButtonGroup aria-label="Basic example" style={{marginTop: 50, marginBottom: 30}}>
                <Button variant={this.state.login ? "primary" : "light"} onClick={this.onLogin}>Log in</Button>
                <Button variant={this.state.login ? "light" : "primary"} onClick={this.onSignup}>Sign up</Button>
              </ButtonGroup>
              {
                this.state.login ? <SignIn /> : <Register />
              }
            </Col>
            <Col />          
          </Row>
        </Container>
      </div>
    )
  }
}