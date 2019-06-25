import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AddClass from '../components/AddClass';
import ClassesList from '../components/ClassesList';
import SingleClassTeacher from '../components/SingleClassTeacher';

export default class TeacherMain extends React.Component {
  state = {
    accessToken: '',
    refreshToken: '',
    userid: '',
    usertype: '',
    username: '',
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
      fetch('http://127.0.0.1:5000/user/teacher', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
      }).then((res) => {
        if (res.status !== 200) {
          sessionStorage.clear()
          this.setState({
            accessToken: '',
            refreshToken: '',
            userid: '',
            usertype: '',
            username: '',
            loggedIn: false
          })
        }  
        return res.json()
        }
      )
    .then(data => {
      console.log(data)
      this.setState({
        username: data.user.username
      })
    })
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
    if (this.state.usertype !== 'TEACHER') {
      return <p>Access not permitted!</p>
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Teacher Classroom</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Nav className="mr-auto">
            <Nav.Link href="/my/teacher/classes">My Classes</Nav.Link>
            <Nav.Link href="/my/teacher/classes/add">Add New Class</Nav.Link>
          </Nav>
          <Nav className="justify-content-end" activeKey="/">
            <Nav.Item>
              <Nav.Link onClick={this.onLogout}>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path={`${this.props.match.path}`} render={(props) => 
            <ClassesList
              data={this.state}
              onBadToken={this.onBadToken}
              {...props}
            />
          }/>
          <Route path={`${this.props.match.path}/add`} render={(props) => 
            <AddClass
              data={this.state}
              onBadToken={this.onBadToken}
              {...props}
            />
          }/>
          <Route path={`${this.props.match.path}/:classid`} render={(props) => 
            <SingleClassTeacher
              data={this.state}
              onBadToken={this.onBadToken}
              {...props}
            />
          }/>
        </Switch>
      </div>
    )
  }
}