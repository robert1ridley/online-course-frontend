import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';

export default class SignIn extends React.Component{
  state = {
    username: '',
    password: '',
    passwordConfirm: '',
    usertype: 'STUDENT',
    error: false,
    message: '',
    accessToken: '',
    refreshToken: '',
    loggedIn: false
  }

  componentDidMount() {
    let accessToken = sessionStorage.getItem('accessToken');
    let refreshToken = sessionStorage.getItem('refreshToken');
    let usertype = sessionStorage.getItem('usertype');
    if (usertype !== null & refreshToken !==null & accessToken !== null) {
      this.setState({
        accessToken: accessToken,
        refreshToken: refreshToken,
        usertype: usertype,
        loggedIn: true
      })
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  setUserTypeStudent = event => {
    this.setState({
      usertype: 'STUDENT'
    })
  }

  setUserTypeTeacher = event => {
    this.setState({
      usertype: 'TEACHER'
    })
  }

  getPayload = () => {
    const payload = {
      username: this.state.username,
      password: this.state.password,
      usertype: this.state.usertype
    };
    return payload;
  };

  handleResponse = (response) => {
    if (response.error) {
      this.setState({
        error: response.error,
        message: response.message
      })
    }
    else{
      sessionStorage.setItem('accessToken', response.access_token);
      sessionStorage.setItem('refreshToken', response.refresh_token);
      sessionStorage.setItem('uuid', response.user_id);
      sessionStorage.setItem('usertype', this.state.usertype);
      this.setState({
        error: false,
        message: '',
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        loggedIn: true
      })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const payload = this.getPayload();
    fetch('http://127.0.0.1:5000/login', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
     }).then(response => response.json()
     .then(response => {
       let res = JSON.stringify(response);
       res = JSON.parse(res);
       this.handleResponse(res);
     })
     .catch(error => console.error('Error:', error))
     )
    };

  render(){
    if (this.state.loggedIn) {
      if (this.state.usertype === 'STUDENT'){
        return <Redirect to="/my/student/classes" />;
      }
      if (this.state.usertype === 'TEACHER'){
        return <Redirect to="/my/teacher/classes" />;
      }
    }
    return (
      <div>
        {
          this.state.error ?
          <Alert  variant='danger'>
            {this.state.message}
          </Alert> :
          <div />
        }
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="name" onChange={this.handleChange('username')} placeholder="Enter username" required/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" onChange={this.handleChange('password')} placeholder="Password" required/>
          </Form.Group>
          <fieldset>
            <Form.Group>
              <Form.Check
                type="radio"
                label="Student"
                name="userrole"
                id="userrowle1"
                checked={this.state.usertype === "STUDENT" ? "checked" : false}
                onChange={this.setUserTypeStudent}
              />
              <Form.Check
                type="radio"
                label="Teacher"
                name="userrole"
                id="userrole2"
                checked={this.state.usertype === "TEACHER" ? "checked" : false}
                onChange={this.setUserTypeTeacher}
              />
            </Form.Group>
          </fieldset>
          <Button variant="primary" type="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}
