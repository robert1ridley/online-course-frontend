import React from 'react';
import { Redirect } from 'react-router-dom';
import StudentMain from './StudentMain';
import TeacherMain from './TeacherMain';

export default class Home extends React.Component {
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
    this.setState({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userid: id,
      usertype: usertype
    })
  }

  render() {
    return (
      <div>
        {
          !this.state.loggedIn && <Redirect to="Login" />
        }
        {
          this.state.usertype === 'STUDENT' && <StudentMain userInfo={this.state} />
        }
        {
          this.state.usertype === 'TEACHER' && <TeacherMain userInfo={this.state} />
        }
      </div>
    )
  }
}