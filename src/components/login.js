import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AlertComponent from './alert'
import Loader from './loader'
import axios from 'axios'
import { login, isLogin } from "../utils/utils"
import { useState, useEffect } from 'react';
import {
    Redirect,
    Link
} from "react-router-dom";

const StyledContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Login = () => {
    const [isMount, setIsMounted] = useState(false);
    const [userLoggedIn, setLogin] = useState(false);
    const [showLoader, setShowLoader] = useState(false)
    const [alert, setAlert] = useState({ show: false })
    useEffect(() => {
        if (isMount)
            setLogin(isLogin());
        setIsMounted(true);
    }, [isMount])
    const loginHandler = event => {
        event.preventDefault();
        setShowLoader(true)
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
            .catch(err => {
                setShowLoader(false)
                alertHandler('warning ', 'Could Not Authenticate')
            })
    }
    const alertHandler = (type, message) => {
        setAlert({
            show: true,
            type: type,
            message: message
        })
        const timeout = setTimeout(() => setAlert({ show: false }), 3000);
        return () => clearTimeout(timeout);
    }
    if (userLoggedIn)
        return (<Redirect
            to={{
                pathname: "/"
            }}
        />)
    else
        return (
            <StyledContainer>
                <h3>Task Manager</h3>
                <Row className={`${showLoader || alert.show ? 'blur' : ''}`}>
                    <Col>
                        <Card>
                            <Card.Body>
                                <h3>Login</h3>
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
                            <Link to="/register">
                                <Button variant="outline-success" style={{ width: '100%' }}>
                                    Don't have an account? Register Here.
                            </Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
                <Loader show={showLoader} />
                <AlertComponent show={alert.show} type={alert.type} message={alert.message} />
            </StyledContainer >);

}

export default Login;