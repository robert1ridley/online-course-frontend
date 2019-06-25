import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class AddClassStudent extends React.Component{
    state = {
        classesList: []
    }

    componentDidMount(){
        const { accessToken, usertype, onBadToken } = this.props.data;
        const payload = {
            usertype: usertype
        }
        fetch('http://127.0.0.1:5000/user/student/allclasses', {
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
            onBadToken()
          }  
          return res.json()
          }
        )
      .then(data => {
          this.setState({
              classesList: JSON.parse(data)
          })
        })
      .catch(err => {console.log(err)})
    }

    removeTimeFromDate = (dateIn) => {
        const timeRemoved = dateIn.split(' ')
        return timeRemoved[0]
    }

    onSignUp = (event, classId) => {
        const { accessToken, usertype, onBadToken, userid } = this.props.data;
        const payload = {
            usertype: usertype,
            class_id: classId,
            userid: userid
        }
        event.preventDefault()
        fetch('http://127.0.0.1:5000/user/student/classsignup', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
      })
      .then((res) => {
          if (res.status !== 200) {
            // TODO: FIX the onbadtoken method call
            sessionStorage.clear()
            onBadToken()
          }  
          return res.json()
          }
        )
      .then(data => {
          console.log(JSON.stringify(data))
        })
      .catch(err => {console.log(err)})
    }

    render(){
        const { classesList } = this.state;
        const { username } = this.props.data;
        return (
            <div style={{marginTop: 50}}>
                <h1>Hi {username}! Your Classes</h1>
                    {
                        classesList &&
                        <div style={{marginTop: 30}}>
                            <ul>
                                {
                                    classesList.map(class_ => 
                                        <Card key={class_.class_uuid} style={{ width: '32rem', margin: '0 auto', float: 'none', marginBottom: 10 }}>
                                            <Card.Body>
                                                <Card.Title>{class_.class_name}</Card.Title>
                                                <Card.Text>{class_.class_description}</Card.Text>
                                                <Card.Text><strong>Teacher: </strong>{class_.teacher_name}</Card.Text>
                                                <Card.Text><strong>Students: </strong>{class_.students_signed_up.length}</Card.Text>
                                                <Card.Text><strong>Assignments: </strong>{class_.assignments.length}</Card.Text>
                                                <Card.Text><strong>Class Closes: </strong>{this.removeTimeFromDate(class_.class_end_date)}</Card.Text>
                                                <Button
                                                    onClick={e =>
                                                        window.confirm(`Sign up for ${class_.class_name}?`) &&
                                                        this.onSignUp(e, class_.class_uuid)
                                                    }
                                                >
                                                Sign Up!</Button>
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                            </ul>
                        </div>
                    }
                {
                    classesList.length === 0 && 
                    <div style={{marginTop: 30}}>
                        <h2>There are currently no classes available!</h2>
                        <Button href="/">Home</Button>
                    </div>
                }
            </div>
        )
    }
}