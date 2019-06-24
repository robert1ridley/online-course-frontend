import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import StudentMain from '../pages/StudentMain';
import TeacherMain from '../pages/TeacherMain';
import NotFound from '../pages/NotFound';

export default class Routes extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/my/student" component={StudentMain} />
            <Route path="/my/teacher/classes" component={TeacherMain} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}
