import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import {
    Redirect
} from "react-router-dom";
import { getToken } from "../utils"
import { useState, useEffect } from 'react';

const StyledContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Dashboard = () => {
    const [tasks, updateTasks] = useState([])
    const getTasks = () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3001/tasks',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => updateTasks(res.data))
            .catch(err => console.log(err))
    }

    const deleteTask = event => {
        if (event && event.target && event.target.id) {
            const options = {
                method: 'DELETE',
                url: 'http://localhost:3001/tasks/' + event.target.id,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            };
            axios(options)
                .then(res => getTasks())
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        getTasks()
    });
    return (
        <StyledContainer>
            <Row>
                <Col>Tasks</Col>
            </Row>
            {tasks.map(task => (
                <Row key={task._id}>
                    <Col>
                        {task.description}
                    </Col>
                    <Col>
                        <Button variant='danger' id={task._id} onClick={deleteTask}>Del</Button>
                    </Col>
                </Row>
            ))}
        </StyledContainer>
    );
}

export default Dashboard;