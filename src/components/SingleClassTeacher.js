import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

export default class SingleClassTeacher extends React.Component {
    state = {
        error: null,
        message: null,
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
        const { accessToken, refreshToken, loggedIn, userid, username, usertype } = this.props.data;
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
                    message: data.message
                })
            }
            else {
                data = JSON.parse(data)
                this.setState({
                    error: null,
                    message: null,
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
        if (this.state.error){
            return (
                <div>
                    <p style={{marginTop: 50}}>Oops! There was an error: {this.state.message}</p>
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
                </Container>
            </Jumbotron>
        )
    }
}

const styles = {
    lowerMargin: {
        marginBottom: 30
    }
}