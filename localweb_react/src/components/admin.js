import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import axios from 'axios';
import { selectUser } from "../redux/features/user";
import '../css/Profile.css'
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import Profile from "./Profile";
import { addUsers } from '../redux/features/user';
import { useDispatch } from 'react-redux';
import SignUp from './SignUp';
import Select from 'react-select';
import { message } from 'antd';

//ADMIN COMPONENT
function Admin() {

    const dispatch = useDispatch()

    const user = useSelector(selectUser)

    const [index, setIndex] = useState(null)

    if (!user.token) {
        window.location.href = "/"
    }

    //DELETE USER ON CLICK BUTTON FUNCTION
    function deleteUser(row, e) {

        e.preventDefault()

        const data = {
            id: row.id,
            role: row.role
        }

        axios.post("http://localhost:3001/deleteUser", data, {
            headers: {
                Authorization: user.token
            }
        }).then((res) => {
            message.success("User Deleted")
        })
    }

    //MODAL DISPLAY VALUE
    const [show, setShow] = useState(false);

    //ON CHANGE PASSWORD BUTTON CLICK MODAL
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //MODAL DISPLAY VALUE
    const [showPassword, setShowPassword] = useState(false);

    //ON CHANGE PASSWORD BUTTON CLICK MODAL
    const handleClosePassword = () => setShowPassword(false);
    const handleShowPassword = () => setShowPassword(true);


    //EDIT USER ON CLICK BUTTON FUNCTION
    function editUser(row, e) {

        handleShow()

        setIndex(row.id)
    }

    const columns = [
        {
            name: 'Actions',
            cell: row => <div><button className="deleteButton btn" onClick={(e) => deleteUser(row, e)} style={{ width: 80, marginTop: 10 }}>Delete</button> <button className="deleteButton btn" onClick={(e) => editUser(row, e)} style={{ width: 80, marginTop: 10, marginBottom: 10 }}>Edit</button> </div>,
        },
        {
            name: 'Avatar',
            cell: row => <img height="50px" width="50px" alt='User Avatar' src={row.avatar} />,
        },
        {
            name: 'Id',
            selector: row => row.id,
            style: { backgroundColor: "orange" }
        },
        {
            name: 'Name',
            selector: row => row.emri,
        },
        {
            name: 'Surname',
            selector: row => row.mbiemri,
            style: { backgroundColor: "orange" }

        },
        {
            name: "Father's Name",
            selector: row => row.atesia,
        },
        {
            name: 'Email',
            selector: row => row.email,
            style: { backgroundColor: "orange" }

        },
        {
            name: 'Phone Number',
            selector: row => row.nr_tel,

        },
        {
            name: 'Username',
            selector: row => row.username,
            style: { backgroundColor: "orange" }
        },
        {
            name: 'Birthday',
            selector: row => row.datelindja,

        },
        {
            name: 'Role',
            selector: row => row.role,
            style: { backgroundColor: "orange" }
        }
    ];

    const [users, setUsers] = useState({});

    const [options, setOptions] = useState({})

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("")

    const [select2, setSelect2] = useState("")

    const countPerPage = 100;

    const data = {
        page: page,
        countPerPage: countPerPage,
        search: search,
        select2: select2
    }

    useEffect(function getSelectOptions() {
        let config = {
            method: 'get',
            url: "http://localhost:3001/select2",
            headers: {
                'Authorization': user.token
            },
        }
        axios(config).then(function (response) {
            setOptions(response.data.users.data.map(data => ({ label: data.email, value: data.id })))
        }).catch(function (error) {
            console.log(error)
        })
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(function getUserList() {
        var config = {
            method: 'get',
            url: 'http://localhost:3001/users',
            headers: {
                'Authorization': user.token
            },
            params: data
        };
        axios(config)
            .then(function (response) {
                setUsers(response.data)
                dispatch(addUsers(response.data))
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function addUser() {
        handleShowPassword()
    }

    function handleFilter() {
        var config = {
            method: 'get',
            url: 'http://localhost:3001/users',
            headers: {
                'Authorization': user.token
            },
            params: data
        };
        axios(config)
            .then(function (response) {
                setUsers(response.data)
                dispatch(addUsers(response.data))
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    function handleSelectChange(selectedOption) {
        if (!selectedOption) {
            setSelect2("")
        } else {
            setSelect2(selectedOption.label)
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col userClass">
                    <div>
                        <Button onClick={addUser}>Add User</Button>
                    </div>
                </div>
                <div className="col">
                    <div className='searchClass'>Search:</div><input onChange={(e) => setSearch(e.target.value)}></input>
                    <div style={{ padding: 5 }}>
                    </div>
                    <div className="col">
                        <div className='selectClass'>
                            <Select
                                onChange={(selectedOption) => handleSelectChange(selectedOption)}
                                onInputChange
                                options={options}
                                isClearable
                            />
                        </div>
                        <div className='filterClass'>
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tableDiv">
                <div style={{ border: "1px solid black", margin: 20, padding: 10, backgroundColor: "white" }}>

                    <DataTable
                        title="Users"
                        columns={columns}
                        data={users}
                        highlightOnHover
                        dense
                        paginationServer
                        paginationTotalRows={users.total}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setPage(page)}
                    />
                    <div>
                        <Modal
                            show={show}
                            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                            onHide={handleClose}
                            keyboard={false}
                        >
                            <div style={{ width: "150%", backgroundColor: "white" }}>
                                {show && <Profile id={index} />}
                            </div>
                        </Modal>
                        <Modal
                            show={showPassword}
                            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                            onHide={handleClosePassword}
                            keyboard={false}
                        >
                            <div>
                                {showPassword && <SignUp isAdmin={true} />}
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin

