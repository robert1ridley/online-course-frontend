import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default class ClassesList extends React.Component {
    state = {
        userClasses: []
    }

    componentDidMount() {
        const { accessToken, userid, usertype, onBadToken } = this.props.data;
        const payload = {
            userid: userid,
            usertype: usertype
        }
        fetch('http://127.0.0.1:5000/user/teacher/allclasses', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
      }).then((res) => {
        if (res.status !== 200) {
          sessionStorage.clear()
          onBadToken()
        }  
        return res.json()
        }
      )
    .then(data => {
        this.setState({
            userClasses: JSON.parse(data.classes)
        })
    })
    .catch(err => {console.log(err)})
    }

    removeTimeFromDate = (dateIn) => {
        const timeRemoved = dateIn.split(' ')
        return timeRemoved[0]
    }

    render(){
        const { userClasses } = this.state;
        const { username } = this.props.data;
        return (
            <div style={{marginTop: 50}}>
                <h1>Hi {username}! Your Classes</h1>
                    {
                        userClasses &&
                        <div style={{marginTop: 30}}>
                            <ul>
                                {
                                    userClasses.map(class_ => 
                                        <Card key={class_.class_uuid} style={{ width: '32rem', margin: '0 auto', float: 'none', marginBottom: 10 }}>
                                            <Card.Body>
                                                <Card.Title>{class_.class_name}</Card.Title>
                                                <Card.Text>{class_.class_description}</Card.Text>
                                                <Card.Text><strong>Students: </strong>{class_.students_signed_up.length}</Card.Text>
                                                <Card.Text><strong>Assignments: </strong>{class_.assignments.length}</Card.Text>
                                                <Card.Text><strong>Class Closes: </strong>{this.removeTimeFromDate(class_.class_end_date)}</Card.Text>
                                                <Card.Link href={`/my/teacher/classes/${class_.class_uuid}`}>Open Class</Card.Link>
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                            </ul>
                            <Button href="/my/teacher/classes/add" style={{margin: '0 auto', float: 'none'}}>Add More Classes</Button>
                        </div>
                    }
                {
                    userClasses.length === 0 && 
                    <div style={{marginTop: 30}}>
                        <h2>You currently don't have any classes!</h2>
                        <Button href="/my/teacher/classes/add">Add Classes</Button>
                    </div>
                }
            </div>
        )
    }
}