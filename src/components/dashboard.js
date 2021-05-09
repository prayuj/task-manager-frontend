import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Loader from './loader'
import AlertComponent from './alert'
import axios from 'axios'
import { logout, getToken } from "../utils/utils"
import { useState, useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination'

const StyledContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position:relative;
`

const Dashboard = () => {
    const [shouldComponentUpdate, setShouldComponentUpdate] = useState(true)
    const [tasks, updateTasks] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState({});
    const [showLoader, setShowLoader] = useState(true)
    const [alert, setAlert] = useState({ show: false })

    const handleModalShow = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    const getTasks = () => {
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_TASKMANAGER_API + `/tasks?limit=10}`,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                setShouldComponentUpdate(false)
                setShowLoader(false)
                updateTasks(res.data)
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
    }

    const deleteTask = event => {
        setShowLoader(true)
        handleModalClose()
        if (event && event.target && event.target.id) {
            const options = {
                method: 'DELETE',
                url: process.env.REACT_APP_TASKMANAGER_API + '/tasks/' + event.target.id,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            };
            axios(options)
                .then(res => {
                    alertHandler('warning ', 'Deleted Successfully')
                    setShouldComponentUpdate(true)
                })
                .catch(err => {
                    if (err.response.status === 401)
                        logout()
                })
        }
    }

    const addTaskHandler = event => {
        setShowLoader(true)
        handleModalClose()

        event.preventDefault();
        const description = event.target.elements.description.value
        const completed = event.target.elements.completed.checked
        const options = {
            method: 'POST',
            data: { description, completed },
            url: process.env.REACT_APP_TASKMANAGER_API + '/tasks',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                if (res.status === 201) {
                    alertHandler('success ', 'Added Successfully')
                    setShouldComponentUpdate(true)
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
    }

    const updateTaskHandler = event => {
        setShowLoader(true)
        handleModalClose()

        event.preventDefault();

        const description = event.target.elements.description.value
        const completed = event.target.elements.completed.checked
        const id = event.target.id
        const options = {
            method: 'PATCH',
            data: { description, completed },
            url: process.env.REACT_APP_TASKMANAGER_API + '/tasks/' + id,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                if (res.status === 200) {
                    alertHandler('secondary', 'Updated Successfully')
                    setShouldComponentUpdate(true)
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            })
    }

    const handleAddTaskModalShow = () => {
        setModalType({
            action: 'add',
            title: 'Add Task',
            description: '',
            completed: true,
            handler: addTaskHandler
        })
        handleModalShow()
    }

    const handleEditTaskModalShow = (event) => {
        setShowLoader(true)
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_TASKMANAGER_API + '/tasks/' + event.target.id,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                if (res.status === 200) {
                    setModalType({
                        action: 'edit',
                        title: 'Edit Task',
                        _id: res.data._id,
                        description: res.data.description,
                        completed: res.data.completed,
                        handler: updateTaskHandler,
                        deleteJSX:
                            <Button variant="danger" id={res.data._id} onClick={deleteTask}>
                                Delete
                            </Button>
                    })

                    setShowLoader(false)
                    handleModalShow()
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
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

    useEffect(() => {
        if (shouldComponentUpdate) {
            getTasks()
        }
    }, [shouldComponentUpdate]);

    return (
        <StyledContainer>
            <Button onClick={logout} variant="danger" size='sm' className="logout">Logout</Button>
            <Row className={`${showLoader || alert.show ? 'blur' : ''}`}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                Task
                            </th>
                            <th>
                                <Button variant='primary' onClick={handleAddTaskModalShow} size="sm">Add</Button>
                            </th>
                        </tr>
                    </thead>
                    {tasks.map((task, i) => (
                        <tbody>
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td className={`${task.completed ? 'done' : ''}`}>{task.description}</td>
                                <td>
                                    <Button variant='warning' id={task._id} onClick={handleEditTaskModalShow} size="sm">Edit</Button>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </Table>
                <Pagination>
                    <Pagination.Prev />
                    <Pagination.Next />
                </Pagination>
            </Row>
            <Modal show={modalShow} onHide={handleModalClose} centered>
                <Form onSubmit={modalType.handler} id={modalType._id}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Task</Form.Label>
                            <Form.Control type="text" placeholder="Enter Task Description" name="description" required defaultValue={modalType.description} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Completed" name="completed" defaultChecked={modalType.completed} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        {modalType.deleteJSX}
                        <Button variant="primary" type="submit">
                            {modalType.title}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Loader show={showLoader} />
            <AlertComponent show={alert.show} type={alert.type} message={alert.message} />
        </StyledContainer >
    );
}

export default Dashboard;