import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
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
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/my/student" component={StudentMain} />
            <Route exact path="/my/teacher" component={TeacherMain} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}
