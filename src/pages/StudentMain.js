import React from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default class StudentMain extends React.Component {
  state = {
    accessToken: '',
    refreshToken: '',
    userid: '',
    usertype: '',
    loggedIn: true
  }

  componentDidMount() {
    let accessToken = sessionStorage.getItem('accessToken');
    let refreshToken = sessionStorage.getItem('refreshToken');
    let id = sessionStorage.getItem('uuid');
    let usertype = sessionStorage.getItem('usertype');
    const payload = {
      usertype: usertype,
      userid: id
    }
    this.setState({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userid: id,
      usertype: usertype
    })
    if (!accessToken || !refreshToken){
      this.setState({
        loggedIn: false
      })
    } else {
      fetch('http://127.0.0.1:5000/user/student', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
      })
      .then((res) => {
          if (res.status !== 200) {
            sessionStorage.clear()
            this.setState({
              accessToken: '',
              refreshToken: '',
              userid: '',
              usertype: '',
              loggedIn: false
            })
          }  
          return res.json()
          }
        )
      .then(data => {console.log(data)})
      .catch(err => {console.log(err)})
    }
  }

  onLogout = () => {
    fetch('http://127.0.0.1:5000/logout/access', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    })
    .then(res => res.json())
    .then(data => { 
      sessionStorage.clear()
      this.setState({
        loggedIn: false
      })
    })
    .catch(err => { console.log(err) })
  }

  onBadToken = () => {
    sessionStorage.clear()
    this.setState({
      loggedIn: false
    })
  }

  render() {
    if (!this.state.loggedIn) {
      return  <Redirect to="/" />
    }
    if (this.state.usertype !== 'STUDENT') {
      return <p>Access not permitted!</p>
    }
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Online Classroom</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Nav className="mr-auto">
          <Nav.Link href="/">My Classes</Nav.Link>
          <Nav.Link href="/">Add New Class</Nav.Link>
        </Nav>
        <Nav className="justify-content-end" activeKey="/">
          <Nav.Item>
            <Nav.Link onClick={this.onLogout}>Logout</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    )
  }
}