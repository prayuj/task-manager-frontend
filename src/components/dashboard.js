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
import { useHistory } from 'react-router-dom';

const StyledContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position:relative;
`

const Dashboard = () => {
    let history = useHistory();
    const [shouldGetTasks, setShouldGetTasks] = useState(false)
    const [isMount, setIsMounted] = useState(false);
    const [tasks, updateTasks] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState({});
    const [showLoader, setShowLoader] = useState(true)
    const [alert, setAlert] = useState({ show: false })
    const [numberOfPages, setNumberOfPages] = useState(1)
    const [activePage, setActivePage] = useState(1)

    const handleModalShow = () => setModalShow(true)
    const handleModalClose = () => {
        setModalShow(false)
        unsetURLParam('add_task')
        unsetURLParam('edit_task')
    }

    const getTasks = () => {
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_TASKMANAGER_API + `/tasks?limit=10&skip=${10 * (activePage - 1)}`,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        };
        axios(options)
            .then(res => {
                setShouldGetTasks(false)
                setShowLoader(false)
                updateTasks(res.data.tasks)
                var pages = (res.data.total % 10 === 0 ? res.data.total / 10 : Math.floor(res.data.total / 10) + 1)
                setNumberOfPages(pages);
                if (activePage > pages) {
                    setPageHandler(1)
                }
                if (!isMount) {
                    setIsMounted(true)
                }
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
                    setShouldGetTasks(true)
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
                    setShouldGetTasks(true)
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
                    setShouldGetTasks(true)
                    alertHandler('secondary', 'Updated Successfully')
                }
            })
            .catch(err => {
                if (err.response.status === 401)
                    logout()
            }).finally(() => {
            })
    }

    const handleAddTaskModalShow = () => {
        setURLParam('add_task', true)
        setModalType({
            action: 'add',
            title: 'Add Task',
            description: '',
            completed: false,
            handler: addTaskHandler
        })
        handleModalShow()
    }

    const handleEditTaskModalShow = (event) => {
        setURLParam('edit_task', event.target.id)
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

    const setURLParam = (key, value) => {
        var search = history.location.search
        if (search.indexOf('?') !== -1) {
            const params = search.split('?')[1].split('&')
            search = '?'
            let updateFlag = false
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf(key) !== -1) {
                    search += key + '=' + value
                    updateFlag = true
                } else {
                    search += params[i]
                }
                if (i !== params.length - 1) search += '&'
            }
            if (!updateFlag) search += '&' + key + '=' + value
        }
        else search = '?' + key + '=' + value

        history.push({
            pathname: '/',
            search
        })
    }

    const unsetURLParam = (key) => {
        var search = history.location.search
        if (search.indexOf('?') !== -1) {
            const params = search.split('?')[1].split('&')
            search = '?'
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf(key) !== -1) continue
                else search += params[i]
                search += '&'
            }
            if (search !== '?') {
                search = search[search.length - 1] === '&' ? search.slice(0, search.length - 1) : search
                history.push({
                    pathname: '/',
                    search
                })
            } else {
                history.push({
                    pathname: '/'
                })
            }

        }
    }

    const readURLParam = () => {
        setShowLoader(true)
        const search = history.location.search
        let pageNumberFlag = false
        if (search.indexOf('?') !== -1) {
            const params = search.split('?')[1].split('&')
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf('page') !== -1) {
                    const pageNumber = parseInt(params[i].split('=')[1])
                    pageNumberFlag = true
                    setActivePage(pageNumber)
                }
                else if (params[i].indexOf('add_task') !== -1) {
                    handleAddTaskModalShow()
                }
                else if (params[i].indexOf('edit_task') !== -1) {
                    handleEditTaskModalShow(
                        {
                            target: {
                                id: params[i].split('=')[1]
                            }
                        })
                }
            }
        }
        if (!pageNumberFlag) {
            setActivePage(1)
            setURLParam('page', 1)
        }
        setShouldGetTasks(true)
        setIsMounted(true);
    }

    const setPageHandler = (page) => {
        setActivePage(page)
        setShouldGetTasks(true)
        setShowLoader(true)
        setURLParam('page', page)
    }

    const createTaskEventObject = (task) => {
        return {
            target: {
                elements: {
                    description: {
                        value: task.description
                    },
                    completed: {
                        checked: task.completed
                    }
                },
                id: task._id
            },
            preventDefault() {

            }
        }
    }

    useEffect(() => {

        if (shouldGetTasks) {
            getTasks()
        }

        if (!isMount) readURLParam()

        return history.listen((location) => {
            if (history.action === 'POP') readURLParam()
        })

    }, [shouldGetTasks, isMount, history]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <StyledContainer>
            <Button onClick={logout} variant="danger" size='sm' className="logout">Logout</Button>
            <h3>My Tasks</h3>
            <Row className={`justify-content-center ${showLoader || alert.show ? 'blur' : ''}`}>
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
                                <td className='edit_cols'>
                                    <Form.Check
                                        type="switch"
                                        id={"completed-" + i}
                                        checked={task.completed}
                                        onChange={() => {
                                            task.completed = !task.completed;
                                            updateTaskHandler(createTaskEventObject(task))
                                        }}
                                    />
                                    <i class="fas fa-edit" id={task._id} onClick={handleEditTaskModalShow}></i>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </Table>
                <Pagination>
                    {[...Array(numberOfPages)].map((x, i) => {
                        if (i + 1 === activePage) return <Pagination.Item active key={i + 1}>{i + 1}</Pagination.Item>
                        else return <Pagination.Item key={i + 1} onClick={() => setPageHandler(i + 1)} >{i + 1}</Pagination.Item>
                    }
                    )}
                </Pagination>
            </Row>
            <Modal show={modalShow} onHide={handleModalClose} centered className={`${showLoader || alert.show ? 'blur' : ''}`}>
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
            <AlertComponent show={alert.show} type={alert.type} message={alert.message} />
            <Loader show={showLoader} />
        </StyledContainer >
    );
}

export default Dashboard;