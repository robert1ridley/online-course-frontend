import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class ClassListStudent extends React.Component{
    state = {
        classesList: [],
        fetchComplete: false
    }

    componentDidMount(){
        const { accessToken, usertype, onBadToken, userid } = this.props.data;
        const payload = {
            usertype: usertype,
            userid: userid
        }
        console.log(payload)
        fetch('http://127.0.0.1:5000/user/student/myclasses', {
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
        })
        .then(data => {
            console.log(JSON.parse(data))
            this.setState({
                classesList: JSON.parse(data),
                fetchComplete: true
            })
        })
        .catch(err => {console.log(err)})
    }

    removeTimeFromDate = (dateIn) => {
        const timeRemoved = dateIn.split(' ')
        return timeRemoved[0]
    }

    render(){
        const { classesList, fetchComplete } = this.state;
        const { username } = this.props.data;
        if (fetchComplete){
            return (
                <div style={{marginTop: 50}}>
                    <h1>Hi {username}! Your Classes</h1>
                    {
                        classesList.length > 0 ?
                        <div style={{marginTop: 30}}>
                            <ul>
                                {
                                    classesList.map(class_ => 
                                        <Card key={class_.class_uuid} style={{ width: '32rem', margin: '0 auto', float: 'none', marginBottom: 10 }}>
                                            <Card.Body>
                                                <Card.Title>{class_.class_name}</Card.Title>
                                                <Card.Text>{class_.class_description}</Card.Text>
                                                <Card.Text><strong>Teacher: </strong>{class_.teacher_name}</Card.Text>
                                                <Card.Text><strong>Total Students: </strong>{class_.students_signed_up.length}</Card.Text>
                                                <Card.Text><strong>Assignments: </strong>{class_.assignments.length}</Card.Text>
                                                <Card.Text><strong>Class Closes: </strong>{this.removeTimeFromDate(class_.class_end_date)}</Card.Text>
                                                <Card.Link href={`/my/teacher/classes/${class_.class_uuid}`}>Open Class</Card.Link>
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                            </ul>
                        </div> :
                        <div style={{marginTop: 30}}>
                            <h2>You currently don't have any classes!</h2>
                            <Button href="/my/student/classes/add">Add Classes</Button>
                        </div>

                    }
                </div>
            )
        }
        return (
            <div />
        )
    }
}