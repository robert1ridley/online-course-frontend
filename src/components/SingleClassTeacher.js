import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';

export default class SingleClassTeacher extends React.Component {
    state = {
        error: null,
        message: null,
        fetchComplete: false,
        className: '',
        classDescription: '',
        teacherName: '',
        createdOn: '',
        endDate: '',
        studentsSignedUp: [],
        assignments: []
    }
    componentDidMount() {
        const classId = this.props.match.params.classid;
        const { accessToken, userid, usertype } = this.props.data;
        const payload = {
            userid: userid,
            usertype: usertype,
            class_id: classId
        }
        fetch('http://127.0.0.1:5000/user/teacher/singleclass', {
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
                data = JSON.parse(data)
                this.setState({
                    error: null,
                    message: null,
                    fetchComplete: true,
                    className: data.class_name,
                    classDescription: data.class_description,
                    teacherName: data.teacher_name,
                    createdOn: data.created_on,
                    endDate: data.class_end_date,
                    studentsSignedUp: data.students_signed_up,
                    assignments: data.assignments
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
        const { error, message, fetchComplete } = this.state;
        if (fetchComplete) {
            if (error){
                return (
                    <div>
                        <Alert variant='danger'>
                            {message}
                        </Alert>
                        <Button href="/">
                            Home
                        </Button>
                    </div>
                )
            }
            return (
                <Jumbotron>
                    <Container>
                        <h1 style={styles.lowerMargin}>{this.state.className}</h1>
                        <p style={styles.lowerMargin}><strong>About Class: </strong><br/>{this.state.classDescription}</p>
                        <p style={styles.lowerMargin}><strong>Class Started: </strong><br/>{this.removeTimeFromDate(this.state.createdOn)}</p>
                        <p style={styles.lowerMargin}><strong>Class Finishes: </strong><br/>{this.removeTimeFromDate(this.state.endDate)}</p>
                        <Table style={styles.lowerMargin} striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Students Signed Up</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.studentsSignedUp.map(student =>
                                        <tr key={student.uuid}>
                                            <td>{student.username}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                        <Table style={styles.lowerMargin} striped bordered hover>
                            <thead>
                                <tr>
                                    <th colSpan="2">Assignments Set</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.assignments.map(assignment =>
                                        <tr key={assignment.assignment_id}>
                                            <td style={{width: '90%'}}>{assignment.assignment_title}</td>
                                            <td style={{width: '10%'}}><Link to={`${this.props.match.params.classid}/assignments/${assignment.assignment_id}`}>View</Link></td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td colSpan="2"><Button href={`${this.props.match.params.classid}/addassignment`}>Add Assignment</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                </Jumbotron>
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