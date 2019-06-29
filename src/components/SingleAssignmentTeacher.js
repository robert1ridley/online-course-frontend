import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class SingleAssignmentTeacher extends React.Component {
  state = {
    error: null,
    message: null,
    className: '',
    assignmentTitle: '',
    assignmentContent: '',
    assignmentDeadline: '',
    submissions: null,
    fetchComplete: false
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
    })
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
            submissions: data.submissions
          })
        }
    })
    .catch(err => {console.log(err)})
  }

  removeTimeFromDate = (dateIn) => {
    const timeRemoved = dateIn.split(' ')
    return timeRemoved[0]
  }

  handleChange = submission_id => event => {
    event.preventDefault();
    this.setState({
      [submission_id]: event.target.value,
    });
  }

  handleSubmit = (submissionId, studentId, assignmentId) => {
    const grade = this.state[submissionId]
    const { accessToken, userid, usertype } = this.props.data;
    const payload = {
      userid: userid,
      usertype: usertype,
      student_id: studentId,
      assignment_id: assignmentId,
      submission_id: submissionId,
      grade: parseInt(grade)
    }
    fetch('http://127.0.0.1:5000/user/teacher/assignment/grade', {
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
    })
    .then(data => {
      data = JSON.parse(data);
      console.log(data)
      if (data.error) {
        this.setState({
          error: data.error,
          message: data.message,
          fetchComplete: true
        })
      }
      else {
        console.log(data);
        this.setState({
          error: null,
          message: null,
          fetchComplete: true
        })
        window.location.reload();
      }
    })
    .catch(err => {console.log(err)})
  }
  
  render(){
    const { fetchComplete, error, message, assignmentTitle, className, assignmentContent, assignmentDeadline, submissions } = this.state;
    if (fetchComplete) {
      if (error) {
        return (
          <div>
            <Alert variant='danger'>
              {message}
            </Alert>
            <Button onClick={() => window.location.reload()}>Back</Button>
          </div>
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
                <Accordion style={styles.lowerMargin}>
                  {
                    submissions.map(submission => 
                      <Card className="text-center" key={submission.submission_id} style={styles.lowerMargin}>
                        <Card.Header>{submission.student_name}</Card.Header>
                        <Card.Body>
                          <Card.Title>{assignmentTitle}</Card.Title>
                          <Card.Text>
                            {submission.content}
                          </Card.Text>
                            {
                              !submission.grade ?
                              <Row>
                                <Col />
                                <Col md={3} lg={3} sm={6} xs={6}>
                                  <InputGroup className="mb-3">
                                    <FormControl
                                      placeholder="0-100"
                                      aria-label="grade"
                                      aria-describedby="basic-addon2"
                                      onChange={this.handleChange(submission.submission_id)}
                                    />
                                    <InputGroup.Append>
                                      <Button variant="outline-secondary" 
                                        onClick={() => this.handleSubmit(submission.submission_id, submission.student_id, submission.assignment_id)}>
                                          Grade
                                      </Button>
                                    </InputGroup.Append>
                                  </InputGroup>
                                </Col>
                                <Col />
                              </Row> :
                              <p style={styles.lowerMargin}><strong>Grade: </strong><br/>{submission.grade}</p>
                            }
                        </Card.Body>
                        <Card.Footer className="text-muted">{submission.created_on}</Card.Footer>
                      </Card>
                    )
                  }
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