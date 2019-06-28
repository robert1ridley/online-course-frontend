import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class SingleAssignmentStudent extends React.Component{
  state = {
    error: null,
    message: null,
    fetchComplete: false,
    classId: '',
    className: '',
    assignmentId: '',
    assignmentTitle: '',
    assignmentContent: '',
    teacherName: '',
    teacherId: '',
    assignmentDeadline: '',
    newSubmission: '',
    submissions: null
  }
  
  componentDidMount(){
    const { accessToken, userid, usertype, username } = this.props.data;
    const { classid, assignmentid } = this.props.match.params;
    const payload = {
      userid: userid,
      username: username,
      usertype: usertype,
      class_id: classid,
      assignment_id: assignmentid
    }
    fetch('http://127.0.0.1:5000/user/student/assignment/retrieve', {
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
        if (data.error) {
          this.setState({
            error: data.error,
            message: data.message,
            fetchComplete: true
          })
        }
        else {
          data = JSON.parse(data);
          console.log(data)
          this.setState({
            error: null,
            message: null,
            fetchComplete: true,
            classId: data.class_id,
            className: data.class_name,
            assignmentId: data.assignment_id,
            assignmentTitle: data.assignment_title,
            assignmentContent: data.assignment_content,
            teacherId: data.teacher_id,
            teacherName: data.teacher_name,
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { accessToken, userid, username, usertype } = this.props.data;
    const { newSubmission, className, teacherId, teacherName, assignmentId, classId } = this.state;
    const payload = {
        usertype: usertype,
        userid: userid,
        username: username,
        class_name: className,
        class_id: classId,
        teacher_id: teacherId,
        teacher_name: teacherName,
        assignment_id: assignmentId,
        assignment_content: newSubmission
    }
    fetch('http://127.0.0.1:5000/user/student/assignment/submit', {
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
          this.props.onBadToken()
        }
      return res.json()
      }
    )
    .then(data => {
        console.log(data)
        if (data.error) {
            this.setState({
                error: data.error,
                message: data.message
            })
        }
        else {
            this.setState({
                error: data.error,
                message: data.message,
                addSuccess: true,
            })
            window.location.reload();
        }
    })
    .catch(err => {console.log(err)})
}

  render() {
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
              <p style={styles.lowerMargin}><strong>Submitted: </strong><br/>{submissions ? "True" : "False"}</p>
              <p style={styles.lowerMargin}><strong>Grade: </strong><br/>{submissions ? submissions.grade : "Pending ..."}</p>
              {
                !submissions &&
                <div>
                  <p style={styles.lowerMargin}><em>You haven't submitted this assignment yet. Complete below: </em></p>
                  <Form>
                    <Form.Group style={styles.lowerMargin} controlId="ControlTextDescription">
                      <Form.Control as="textarea" rows="20" onChange={this.handleChange('newSubmission')} placeholder="Write your assignment here." />
                    </Form.Group>
                    <Button onClick={this.handleSubmit}>Submit Assignment</Button>
                  </Form>
                </div>
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