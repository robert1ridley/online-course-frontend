import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Register extends React.Component{
  state = {
    username: '',
    password: '',
    passwordConfirm: '',
    usertype: 'STUDENT'
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

  handleSubmit = async (event) => {
    event.preventDefault();
    const payload = this.getPayload();
    fetch('http://127.0.0.1:5000/registration', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
     });
    };

  render(){
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="name" onChange={this.handleChange('username')} placeholder="Enter username" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" onChange={this.handleChange('password')} placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Retype Password</Form.Label>
          <Form.Control type="password" onChange={this.handleChange('passwordConfirm')} placeholder="Password" />
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
    )
  }
}
