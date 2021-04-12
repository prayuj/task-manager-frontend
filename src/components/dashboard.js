import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import {
    Redirect
} from "react-router-dom";
import { logout, getToken } from "../utils"
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
    const [addTaskShow, setAddTaskShow] = useState(false);
    const [editTaskShow, setEditTaskShow] = useState(false);
    // const [editTask]

    const handleAddTaskClose = () => setAddTaskShow(false);
    const handleAddTaskShow = () => setAddTaskShow(true);

    const handleEditTaskClose = () => setEditTaskShow(false);
    const handleEditTaskShow = () => setEditTaskShow(true);

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
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
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
                .catch(err => {
                    if (err.response.status === 401)
                        logout()
                })
        }
    }

    const addTaskHandler = event => {
        event.preventDefault();
        const description = event.target.elements.description.value
        const completed = event.target.elements.completed.checked
        const options = {
            method: 'POST',
            data: { description, completed },
            url: 'http://localhost:3001/tasks',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                if (res.status === 201) {
                    getTasks()
                    handleAddTaskClose()
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
    }

    const updateTaskHandler = event => {
        event.preventDefault();
        const description = event.target.elements.description.value
        const completed = event.target.elements.completed.checked
        const options = {
            method: 'POST',
            data: { description, completed },
            url: 'http://localhost:3001/tasks/',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                if (res.status === 200) {
                    getTasks()
                    handleAddTaskClose()
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
    }

    useEffect(() => {
        getTasks()
    });
    return (
        <StyledContainer>
            <Row>
                <Col>Tasks</Col>
                <Col>
                    <Button variant='primary' onClick={handleAddTaskShow}>Add</Button>
                </Col>
            </Row>
            {tasks.map(task => (
                <Row key={task._id}>
                    <Col>
                        {task.description}
                    </Col>
                    <Col>
                        <Button variant='warning' id={task._id} onClick={handleEditTaskShow}>Update</Button>
                        <Button variant='danger' id={task._id} onClick={deleteTask}>Del</Button>
                    </Col>
                </Row>
            ))}
            <Modal show={addTaskShow} onHide={handleAddTaskClose}>
                <Form onSubmit={addTaskHandler}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Task</Form.Label>
                            <Form.Control type="text" placeholder="Enter Task Description" name="description" required />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Completed" name="completed" defaultChecked />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleAddTaskClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add Task
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={editTaskShow} onHide={handleEditTaskClose}>
                <Form onSubmit={addTaskHandler}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Task</Form.Label>
                            <Form.Control type="text" placeholder="Enter Task Description" name="description" required />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Completed" name="completed" defaultChecked />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditTaskClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add Task
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </StyledContainer>
    );
}

export default Dashboard;