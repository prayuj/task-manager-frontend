import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { login, isLogin } from "../utils/utils"
import { useState, useEffect } from 'react';
import {
    Redirect
} from "react-router-dom";

const StyledContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`



const Login = () => {
    const [userLoggedIn, setLogin] = useState(false);
    useEffect(() => {
        setLogin(isLogin());
    })
    const loginHandler = event => {
        event.preventDefault();
        const email = event.target.elements.email.value
        const password = event.target.elements.password.value
        const options = {
            method: 'POST',
            data: { email: email, password: password },
            url: process.env.REACT_APP_TASKMANAGER_API + '/users/login',
        };
        axios(options)
            .then(res => {
                if (res.status === 200) {
                    login(res.data.token);
                    setLogin(true);
                }
            })
            .catch(err => console.log(err))
    }
    if (userLoggedIn)
        return (<Redirect
            to={{
                pathname: "/"
            }}
        />)
    else
        return (<StyledContainer>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={loginHandler}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" name="email" required />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" name="password" required />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                        </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </StyledContainer>);

}

export default Login;