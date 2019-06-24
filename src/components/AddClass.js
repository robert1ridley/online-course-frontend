import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import DatePicker from "react-datepicker";
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

export default class AddClass extends React.Component {
    state = {
        className: '',
        classDescription: '',
        finishYear: null,
        finishMonth: null,
        finishDay: null,
        end: null,
        error: false,
        message: '',
        addSuccess: false
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    getPickerValue = name => event => {
        const month = event.getUTCMonth() + 1;
        const day = event.getUTCDate();
        const year = event.getUTCFullYear();
        this.setState({
            finishYear: year,
            finishMonth: month,
            finishDay: day,
            end: event
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { accessToken, userid, usertype } = this.props.data;
        const { className, classDescription, finishDay, finishMonth, finishYear } = this.state;
        const payload = {
            usertype: usertype,
            userid: userid,
            class_name: className,
            class_description: classDescription,
            end_year: finishYear,
            end_month: finishMonth,
            end_day: finishDay
        }
        fetch('http://127.0.0.1:5000/user/teacher/newclass', {
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
                this.setState({
                    error: data.error,
                    message: data.message,
                    addSuccess: true
                })
            }
        })
        .catch(err => {console.log(err)})
    }

    render(){
        if (this.state.addSuccess) {
            return <Redirect to="/" />
        }
        return (
            <div style={{marginTop: 60}}>
                <Container>
                    <Row>
                        <Col />
                        <Col md={8} lg={8}>
                            {
                                this.state.error &&
                                <Alert variant='danger'>
                                    {this.state.message}
                                </Alert>
                            }
                            <Form>
                                <Form.Group controlId="formClassCreate">
                                    <Form.Label>Class Name</Form.Label>
                                    <Form.Control type="name" onChange={this.handleChange('className')} placeholder="Enter name of class" required/>
                                </Form.Group>
                                <Form.Group controlId="ControlTextDescription">
                                    <Form.Label>Class Description</Form.Label>
                                    <Form.Control as="textarea" rows="3" onChange={this.handleChange('classDescription')} placeholder="Enter description of class" />
                                </Form.Group>
                                <Form.Group controlId="expiry">
                                    <Form.Label>Class Finish Date</Form.Label>
                                    <div>
                                        <DatePicker
                                            selected={this.state.end}
                                            onChange={this.getPickerValue('finishDate')}
                                        />
                                    </div>
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col />
                    </Row>
                </Container>
            </div>
        )
    }
}