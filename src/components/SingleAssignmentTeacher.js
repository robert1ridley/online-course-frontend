import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class SingleAssignmentTeacher extends React.Component {
  state = {
    error: null,
    message: null,
    className: '',
    assignmentTitle: '',
    assignmentContent: '',
    assignmentDeadline: '',
    submissions: null,
    fetchComplete: false,
  }
  componentDidMount(){
    const { accessToken, userid, usertype, username } = this.props.data;
    const { classid, assignmentid } = this.props.match.params;
    const payload = {
      userid: userid,
      usertype: usertype,
      username: username,
      class_id: classid,
      assignment_id: assignmentid
    }
    fetch('http://127.0.0.1:5000/user/teacher/assignment/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
        })
        .then((res) => {
            if (res.status !== 200) {
                this.props.onBadToken()
                sessionStorage.clear()
            }
          return res.json()
          }
        )
        .then(data => {
            console.log(data)
            if (data.error) {
                this.setState({
                    error: data.error,
                    message: data.message,
                    fetchComplete: true
                })
            }
            else {
                data = JSON.parse(data);
                console.log(data);
                this.setState({
                    error: null,
                    message: null,
                    fetchComplete: true,
                    className: data.class_name,
                    assignmentTitle: data.assignment_title,
                    assignmentContent: data.assignment_content,
                    assignmentDeadline: data.deadline,
                    // submissions: data.submissions
                    // submissions: [1,2]
                })
            }
        })
        .catch(err => {console.log(err)})
    }

  removeTimeFromDate = (dateIn) => {
    const timeRemoved = dateIn.split(' ')
    return timeRemoved[0]
  }
  
  render(){
    const { fetchComplete, error, message, assignmentTitle, className, assignmentContent, assignmentDeadline, submissions } = this.state;
    if (fetchComplete) {
      if (error) {
        return (
          <Alert variant='danger'>
              {message}
          </Alert>
        )
      }
      return (
        <div>
          <Jumbotron>
            <Container>
              <h1 style={styles.lowerMargin}>{className}</h1>
              <p style={styles.lowerMargin}><strong>Assignment Title: </strong><br/>{assignmentTitle}</p>
              <p style={styles.lowerMargin}><strong>Assignment Instructions: </strong><br/>{assignmentContent}</p>
              <p style={styles.lowerMargin}><strong>Deadline: </strong><br/>{this.removeTimeFromDate(assignmentDeadline)}</p>
              <p><strong>Submissions: </strong></p>
              {
                submissions ?
                // TODO: render dynamically
                <Accordion style={styles.lowerMargin}>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Click me!
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>Hello! I'm the body</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Click me!
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion> :
                <p style={styles.lowerMargin}><em>No students have submitted this assignment currently.</em></p>
              }
            </Container>
          </Jumbotron>
        </div>
      )
    }
    return <div />
  }
}

const styles = {
  lowerMargin: {
      marginBottom: 30
  }
}